const { ForbiddenError, UnauthorizedError } = require("../../common/errors");
const { OPENAPI_X_CHECK_GROUP_ROLE } = require("../../common/constants");

function CheckGroupRole({ models }) {
    return async function checkGroupRole(req, res, next) {
        const requiredRoles = req.openapi.schema[OPENAPI_X_CHECK_GROUP_ROLE];
        if (!Array.isArray(requiredRoles)) {
            next();
            return;
        }

        const { groupId } = req.query;
        if (typeof groupId === "undefined") {
            next();
            return;
        }

        const user = await models.Users.findByPk(req.user.id);
        if (!user) {
            throw new UnauthorizedError();
        }
        const hasMembership = await user.hasMembership({
            where: {
                id: groupId,
            },
            through: {
                where: {
                    role: requiredRoles,
                },
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
