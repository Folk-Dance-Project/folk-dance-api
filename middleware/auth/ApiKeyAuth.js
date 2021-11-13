const { UnauthorizedError } = require("../../common/errors");

function ApiKeyAuth({ models, jwt }) {
    return async function apiKeyAuth(req) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError("No authorization header found");
        }
        const [format, token] = authHeader.split(" ");

        if (!format || format !== "Bearer" || !token) {
            throw new UnauthorizedError("Authorization header should be in Bearer format");
        }

        let payload = null;

        try {
            payload = await jwt.decodeToken(token);
        } catch (e) {
            console.log(e);
            throw new UnauthorizedError("Invalid jwt token");
        }

        const { id } = payload;
        const user = await models.Users.findByPk(id);

        if (!user) {
            throw new UnauthorizedError("Unauthorized");
        }

        if (user.apiKeyVersion !== payload.apiKeyVersion) {
            throw new UnauthorizedError("Token expired");
        }

        const { name, email } = user;

        req.user = { id, name, email };

        return true;
    };
}

module.exports = ApiKeyAuth;
