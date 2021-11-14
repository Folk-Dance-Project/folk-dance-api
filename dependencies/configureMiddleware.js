const ApiKeyAuth = require("../middleware/auth/ApiKeyAuth");
const CheckGroupRole = require("../middleware/auth/CheckGroupRole");

function configureMiddleware({ models, services: { jwt } }) {
    const apiKeyAuth = ApiKeyAuth({ models, jwt });
    const checkGroupRole = CheckGroupRole({ models });
    return {
        apiKeyAuth,
        checkGroupRole,
    };
}

module.exports = configureMiddleware;
