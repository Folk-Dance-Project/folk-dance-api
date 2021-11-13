const { ValidationError } = require("../../common/errors");
const { GROUP_MEMBERSHIP_STATUS, GROUP_MEMBERSHIP_ROLES } = require("../../common/constants");

function CreateGroup({ models }) {
    return async function createGroups({ data: { name }, user: { id: userId } }) {
        if (!name.trim()) {
            throw new ValidationError("Name should not be empty");
        }

        const group = await models.Groups.create({
            name: name.trim(),
            userId,
            membersCount: 1,
        });

        await models.GroupMemberships.create({
            userId,
            groupId: group.id,
            status: GROUP_MEMBERSHIP_STATUS.APPROVED,
            role: GROUP_MEMBERSHIP_ROLES.ADMIN,
        });

        return {
            id: group.id,
            name: group.name,
            membersCount: group.membersCount,
        };
    };
}

module.exports = CreateGroup;
