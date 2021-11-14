const { NotFoundError } = require("../../common/errors");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../../common/constants");

function RequestMembership({ models }) {
    return async function requestMembership({ params: { groupId }, user }) {
        const group = await models.Groups.findByPk(groupId);
        if (!group) {
            throw new NotFoundError("Group not found");
        }

        const alreadyRequested = await group.hasMember({ where: { id: user.id } });
        if (alreadyRequested) {
            return {
                id: group.id,
                name: group.name,
                membersCount: group.membersCount,
            };
        }

        await group.addMember(user.id, {
            through: {
                role: GROUP_MEMBERSHIP_ROLES.MEMBER,
                status: GROUP_MEMBERSHIP_STATUS.PENDING,
            },
        });
        group.membersCount += 1;
        await group.save();

        return {
            id: group.id,
            name: group.name,
            membersCount: group.membersCount,
        };
    };
}

module.exports = RequestMembership;
