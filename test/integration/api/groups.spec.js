const { api, models, services } = require("../setup");

describe("Groups API", () => {
    beforeAll(async () => {
        await models.sequelize.sync();
    });

    beforeEach(async () => {
        const user = await models.Users.create({
            name: "abel",
            email: "abel@example.com",
            password: "asd",
            apiKeyVersion: 1,
        });
        services.jwt.decodeToken.mockReturnValueOnce({ id: user.id, apiKeyVersion: 1 });
    });

    afterEach(async () => {
        await models.sequelize.truncate();
    });

    describe("GET /1.0/groups", () => {
        test("response should match openApi schema", async () => {
            const result = await api.get("/1.0/groups").set("Authorization", "Bearer asd");

            expect(result.body).toSatisfySchemaInApiSpec("GroupList");
            expect(result.status).toBe(200);
        });
    });

    describe("POST /1.0/groups", () => {
        test("response should match openApi schema", async () => {
            const result = await api
                .post("/1.0/groups")
                .set("Authorization", "Bearer asd")
                .send({ name: "test group" });

            expect(result.body).toSatisfySchemaInApiSpec("GroupListItem");
            expect(result.status).toBe(200);
        });
    });
});
