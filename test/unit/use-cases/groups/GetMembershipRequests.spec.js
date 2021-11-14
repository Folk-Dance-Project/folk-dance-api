const models = require("../../mocks/models");
const GetMembershipRequests = require("../../../../use-cases/groups/GetMembershipRequests");
const { NotFoundError } = require("../../../../common/errors");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../../../../common/constants");

const getMembershipRequests = GetMembershipRequests({ models });

describe("GetMembershipRequests", () => {
    test("throws not found error if no group", async () => {
        const params = {
            groupId: 1,
        };
        models.Groups.findByPk.mockReturnValueOnce(null);

        const promise = getMembershipRequests({ params });

        await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    });
    test("returns membership requests", async () => {
        const params = {
            groupId: 1,
        };
        const group = {
            id: 1,
            name: "group",
        };
        group.countMembers = jest.fn();
        group.getMembers = jest.fn();
        models.Groups.findByPk.mockReturnValueOnce(group);
        group.countMembers.mockReturnValueOnce(1);
        group.getMembers.mockReturnValueOnce([
            {
                id: 1,
                name: "abel",
                email: "email",
                GroupMemberships: { role: GROUP_MEMBERSHIP_ROLES.MEMBER },
            },
        ]);

        const { total, members } = await getMembershipRequests({ params });

        expect(group.countMembers).toHaveBeenCalledWith(
            expect.objectContaining({
                through: expect.objectContaining({
                    where: expect.objectContaining({ status: GROUP_MEMBERSHIP_STATUS.PENDING }),
                }),
            })
        );
        expect(group.getMembers).toHaveBeenCalledWith(
            expect.objectContaining({
                through: expect.objectContaining({
                    where: expect.objectContaining({ status: GROUP_MEMBERSHIP_STATUS.PENDING }),
                }),
            })
        );

        expect(total).toBe(1);
        expect(members.length).toBe(1);
    });
});
