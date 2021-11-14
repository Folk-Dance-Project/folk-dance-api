const models = require("../../mocks/models");
const GetGroupMembers = require("../../../../use-cases/groups/GetGroupMembers");
const { NotFoundError } = require("../../../../common/errors");
const { GROUP_MEMBERSHIP_STATUS } = require("../../../../common/constants");

const getGroupMembers = GetGroupMembers({ models });

describe("GetGroupMembers", () => {
    test("throws not found error if group is not found", async () => {
        const params = {
            groupId: 1,
        };
        models.Groups.findByPk.mockReturnValueOnce(null);

        const promise = getGroupMembers({ params });

        await expect(promise).rejects.toBeInstanceOf(NotFoundError);
    });
    test("returns a list of group members", async () => {
        const params = {
            groupId: 1,
        };

        const group = {
            id: 1,
        };
        group.getMembers = jest.fn();
        group.countMembers = jest.fn();

        models.Groups.findByPk.mockReturnValueOnce(group);
        group.countMembers.mockReturnValueOnce(2);
        group.getMembers.mockReturnValueOnce([
            { id: 1, name: "user1", email: "hello", GroupMemberships: { role: "member" } },
            { id: 2, name: "user2", email: "hello2", GroupMemberships: { role: "admin" } },
        ]);

        const { total, members } = await getGroupMembers({ params });

        expect(group.countMembers).toHaveBeenCalledWith(
            expect.objectContaining({
                through: expect.objectContaining({
                    where: expect.objectContaining({ status: GROUP_MEMBERSHIP_STATUS.APPROVED }),
                }),
            })
        );
        expect(group.getMembers).toHaveBeenCalledWith(
            expect.objectContaining({
                through: expect.objectContaining({
                    where: expect.objectContaining({ status: GROUP_MEMBERSHIP_STATUS.APPROVED }),
                }),
            })
        );
        expect(total).toBe(2);
        expect(members.length).toBe(2);
    });
});
