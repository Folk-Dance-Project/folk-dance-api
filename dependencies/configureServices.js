const jwt = require("../services/jwt");

function configureServices() {
    return { jwt };
}

module.exports = configureServices;
