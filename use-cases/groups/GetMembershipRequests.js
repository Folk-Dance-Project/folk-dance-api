const { NotFoundError } = require("../../common/errors");
const { GROUP_MEMBERSHIP_STATUS } = require("../../common/constants");

function GetMembershipRequests({ models }) {
    return async function getMembershipRequests({ params: { groupId, offset = 0, limit = 100 } }) {
        const group = await models.Groups.findByPk(groupId);
        if (!group) {
            throw new NotFoundError("Group not found");
        }

        const query = {
            through: {
                where: {
                    status: GROUP_MEMBERSHIP_STATUS.PENDING,
                },
            },
        };
        const [total, members] = await Promise.all([
            group.countMembers(query),
            group.getMembers({ ...query, offset, limit }),
        ]);

        return {
            total,
            members: members.map((m) => ({
                id: m.id,
                name: m.name,
                email: m.email,
                role: m.GroupMemberships.role,
            })),
        };
    };
}

module.exports = GetMembershipRequests;
