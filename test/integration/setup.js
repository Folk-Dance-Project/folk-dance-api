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

const oasDoc = jsyaml.load(fs.readFileSync("api/openapi.yaml", "utf8"));
jestOpenAPI(oasDoc);

const app = new Application({ dependencies });
const api = supertest(app.expressApp);

async function initUser(
    data = { name: "abel", email: "abel@example.com", password: "asd", apiKeyVersion: 1 }
) {
    const user = await models.Users.create(data);
    services.jwt.decodeToken.mockReturnValue({ id: user.id, apiKeyVersion: 1 });

    return user;
}

beforeAll(async () => {
    await models.sequelize.sync();
});

module.exports = { api, models, services, initUser };
