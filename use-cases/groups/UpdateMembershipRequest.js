const { NotFoundError } = require("../../common/errors");
const { GROUP_MEMBERSHIP_STATUS } = require("../../common/constants");

function UpdateMembershipRequest({ models }) {
    return async function updateMembershipRequest({
        params: { groupId },
        data: { userId, status, role },
    }) {
        const group = await models.Groups.findByPk(groupId);
        if (!group) {
            throw new NotFoundError("Group not found");
        }

        const members = await group.getMembers({ where: { id: userId }, limit: 1 });
        if (members.length === 0) {
            throw new NotFoundError("Membership request not found");
        }

        const [member] = members;
        if (
            member.GroupMemberships.status !== GROUP_MEMBERSHIP_STATUS.APPROVED &&
            status === GROUP_MEMBERSHIP_STATUS.APPROVED
        ) {
            group.membersCount += 1;
        }
        if (
            member.GroupMemberships.status === GROUP_MEMBERSHIP_STATUS.APPROVED &&
            status !== GROUP_MEMBERSHIP_STATUS.APPROVED
        ) {
            group.membersCount -= 1;
        }

        await group.save();
        member.GroupMemberships.role = role;
        member.GroupMemberships.status = status;
        await member.save();

        return {
            id: group.id,
            name: group.name,
            membersCount: group.membersCount,
        };
    };
}

module.exports = UpdateMembershipRequest;
