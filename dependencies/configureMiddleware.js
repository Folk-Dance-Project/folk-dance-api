const ApiKeyAuth = require("../middleware/auth/ApiKeyAuth");

function configureMiddleware({ models, services: { jwt } }) {
    const apiKeyAuth = ApiKeyAuth({ models, jwt });
    return {
        apiKeyAuth,
    };
}

module.exports = configureMiddleware;
