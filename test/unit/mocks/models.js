/* eslint-disable func-names,no-underscore-dangle */
jest.mock("sequelize");
const { Model } = require("sequelize");

Model.init.mockImplementation(function (attributes, options) {
    // support iterating through all models in configureModels
    // eslint-disable-next-line no-param-reassign
    options.sequelize.models[options.tableName] = this;
});

// mock the model base constructor for convenience during testing
Model.mockImplementation(function (values = {}) {
    const keys = Object.keys(values);

    for (const key of keys) {
        this[key] = values[key];
    }

    return this;
});

const configureModels = require("../../../models/configureModels");

const sequelize = { models: {} };

const models = configureModels(sequelize);
module.exports = models;
