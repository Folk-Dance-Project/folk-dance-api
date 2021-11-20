const { ForbiddenError, UnauthorizedError } = require("../../common/errors");
const { OPENAPI_X_CHECK_GROUP_ROLE, GROUP_MEMBERSHIP_STATUS } = require("../../common/constants");

function CheckGroupRole({ models }) {
    return async function checkGroupRole(req, res, next) {
        const requiredRoles = req.openapi.schema[OPENAPI_X_CHECK_GROUP_ROLE];
        if (!Array.isArray(requiredRoles)) {
            next();
            return;
        }

        const groupId = parseInt(req.params.groupId, 10);
        if (Number.isNaN(groupId)) {
            next();
            return;
        }

        const user = await models.Users.findByPk(req.user.id);
        if (!user) {
            throw new UnauthorizedError();
        }
        const query = {
            status: GROUP_MEMBERSHIP_STATUS.APPROVED,
        };
        if (requiredRoles.length > 0) {
            query.role = requiredRoles;
        }
        const hasMembership = await user.hasMembership(groupId, {
            through: {
                where: query,
            },
        });
        if (!hasMembership) {
            throw new ForbiddenError(
                "User does not have the required access level for the specified group"
            );
        }

        next();
    };
}

module.exports = CheckGroupRole;
