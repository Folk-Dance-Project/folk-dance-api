const sequelize = require("../models/sequelize");
const configureUseCases = require("./configureUseCases");
const configureModels = require("../models/configureModels");
const configureServices = require("./configureServices");
const configureMiddleware = require("./configureMiddleware");

const models = configureModels(sequelize);
const services = configureServices();
const useCases = configureUseCases({ models, services });
const middleware = configureMiddleware({ models, services });

module.exports = {
    models,
    useCases,
    services,
    middleware,
};
