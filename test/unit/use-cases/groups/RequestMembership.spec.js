const models = require("../../mocks/models");
const RequestMembership = require("../../../../use-cases/groups/RequestMembership");
const { NotFoundError } = require("../../../../common/errors");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../../../../common/constants");

const requestMembership = RequestMembership({ models });

describe("RequestMembership", () => {
    test("throws not found error if group not found", async () => {
        const params = {
            groupId: 1,
        };
        const user = {
            id: 1,
        };
        models.Groups.findByPk.mockReturnValueOnce(null);

        const promise = requestMembership({ params, user });

        await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    });
    test("returns membership request if already requested", async () => {
        const params = {
            groupId: 1,
        };
        const user = {
            id: 1,
        };
        const group = {
            id: 1,
            name: "group",
        };
        group.hasMember = jest.fn();
        group.addMember = jest.fn();
        models.Groups.findByPk.mockReturnValueOnce(group);
        group.hasMember.mockReturnValueOnce(true);

        const groupReturned = await requestMembership({ params, user });

        expect(group.hasMember).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ id: user.id }) })
        );
        expect(group.addMember).toHaveBeenCalledTimes(0);
        expect(groupReturned).toEqual(expect.objectContaining({ id: 1 }));
    });
    test("creates a non-admin membership if status pending ", async () => {
        const params = {
            groupId: 1,
        };
        const user = {
            id: 1,
        };
        const group = {
            id: 1,
            name: "group",
        };
        group.hasMember = jest.fn();
        group.addMember = jest.fn();
        models.Groups.findByPk.mockReturnValueOnce(group);
        group.hasMember.mockReturnValueOnce(false);

        const groupReturned = await requestMembership({ params, user });

        expect(group.hasMember).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ id: user.id }) })
        );
        expect(group.addMember).toHaveBeenCalledWith(
            user.id,
            expect.objectContaining({
                through: expect.objectContaining({
                    status: GROUP_MEMBERSHIP_STATUS.PENDING,
                    role: GROUP_MEMBERSHIP_ROLES.MEMBER,
                }),
            })
        );
        expect(groupReturned).toEqual(expect.objectContaining({ id: 1 }));
    });
});
