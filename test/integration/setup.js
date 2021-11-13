const supertest = require("supertest");
const jestOpenAPI = require("jest-openapi").default;

const jsyaml = require("js-yaml");
const fs = require("fs");

const Application = require("../../Application");

jest.mock("../../models/sequelize", () => {
    const { Sequelize } = jest.requireActual("sequelize");
    return new Sequelize("sqlite::memory:", { logging: false });
});

jest.mock("../../services/jwt");

const dependencies = require("../../dependencies");

const { services, models } = dependencies;

services.jwt.decodeToken.mockReturnValue({ id: 1 });

const oasDoc = jsyaml.load(fs.readFileSync("api/openapi.yaml", "utf8"));
jestOpenAPI(oasDoc);

const app = new Application({ dependencies });
const api = supertest(app.expressApp);

module.exports = { api, models, services };
