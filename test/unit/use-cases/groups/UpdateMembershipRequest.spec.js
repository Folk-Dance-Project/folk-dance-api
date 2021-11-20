const models = require("../../mocks/models");
const UpdateMembershipRequest = require("../../../../use-cases/groups/UpdateMembershipRequest");
const { GROUP_MEMBERSHIP_STATUS, GROUP_MEMBERSHIP_ROLES } = require("../../../../common/constants");
const { NotFoundError } = require("../../../../common/errors");

const updateMembershipRequest = UpdateMembershipRequest({ models });

describe("UpdateMembershipRequest", () => {
    test("throws not found error if group not found", async () => {
        const params = {
            groupId: 1,
        };
        const data = {
            userId: 1,
            status: GROUP_MEMBERSHIP_STATUS.APPROVED,
            role: GROUP_MEMBERSHIP_ROLES.MEMBER,
        };
        models.Groups.findByPk.mockReturnValueOnce(null);

        const promise = updateMembershipRequest({ params, data });

        await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    });
    test("throws not found error if request is not found", async () => {
        const params = {
            groupId: 1,
        };
        const data = {
            userId: 1,
            status: GROUP_MEMBERSHIP_STATUS.APPROVED,
            role: GROUP_MEMBERSHIP_ROLES.MEMBER,
        };
        const group = {
            id: 1,
            name: "group",
        };
        group.getMembers = jest.fn();
        group.getMembers.mockReturnValueOnce([]);
        models.Groups.findByPk.mockReturnValueOnce(group);

        const promise = updateMembershipRequest({ params, data });

        await expect(promise).rejects.toBeInstanceOf(NotFoundError);
        expect(group.getMembers).toHaveBeenCalled();
    });
    test("updates the request and increment members count", async () => {
        const params = {
            groupId: 1,
        };
        const data = {
            userId: 1,
            status: GROUP_MEMBERSHIP_STATUS.APPROVED,
            role: GROUP_MEMBERSHIP_ROLES.MEMBER,
        };
        const group = {
            id: 1,
            name: "group",
            membersCount: 1,
        };
        group.getMembers = jest.fn();
        group.save = jest.fn();
        const user = {
            id: 1,
            name: "name",
            email: "email",
            GroupMemberships: {
                status: GROUP_MEMBERSHIP_STATUS.PENDING,
                role: GROUP_MEMBERSHIP_ROLES.MEMBER,
            },
        };
        user.save = jest.fn();
        group.getMembers.mockReturnValueOnce([user]);
        models.Groups.findByPk.mockReturnValueOnce(group);

        const groupReturned = await updateMembershipRequest({ params, data });

        expect(group.getMembers).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ id: user.id }) })
        );
        expect(user.save).toHaveBeenCalled();
        expect(group.save).toHaveBeenCalled();
        expect(groupReturned.id).toBe(group.id);
        expect(groupReturned.membersCount).toBe(2);
    });
    test("updates the request and decreases members count", async () => {
        const params = {
            groupId: 1,
        };
        const data = {
            userId: 1,
            status: GROUP_MEMBERSHIP_STATUS.DENIED,
            role: GROUP_MEMBERSHIP_ROLES.MEMBER,
        };
        const group = {
            id: 1,
            name: "group",
            membersCount: 1,
        };
        group.getMembers = jest.fn();
        group.save = jest.fn();
        const user = {
            id: 1,
            name: "name",
            email: "email",
            GroupMemberships: {
                status: GROUP_MEMBERSHIP_STATUS.APPROVED,
                role: GROUP_MEMBERSHIP_ROLES.MEMBER,
            },
        };
        user.save = jest.fn();
        group.getMembers.mockReturnValueOnce([user]);
        models.Groups.findByPk.mockReturnValueOnce(group);

        const groupReturned = await updateMembershipRequest({ params, data });

        expect(group.getMembers).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ id: user.id }) })
        );
        expect(user.save).toHaveBeenCalled();
        expect(group.save).toHaveBeenCalled();
        expect(groupReturned.id).toBe(group.id);
        expect(groupReturned.membersCount).toBe(0);
    });
});
