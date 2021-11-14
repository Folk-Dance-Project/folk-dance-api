const crypto = require("crypto");
const {
    api,
    models: { sequelize, Users },
    services,
} = require("../setup");

describe("Auth API", () => {
    afterEach(async () => {
        await sequelize.truncate();
    });

    describe("POST /1.0/auth/register", () => {
        test("response matches openApi schema", async () => {
            services.jwt.generateToken.mockReturnValueOnce("example.token");
            const result = await api
                .post("/1.0/auth/register")
                .send({ email: "abel@example.com", password: "password", name: "abel" });

            expect(result.body).toSatisfySchemaInApiSpec("TokenResult");
            expect(result.status).toBe(200);
        });
    });
    describe("POST /1.0/auth/login", () => {
        test("response matches openApi schema", async () => {
            const password = "123123";
            const hash = crypto.createHash("sha1").update(password).digest().toString("base64");
            const user = new Users({ name: "abel", email: "abel@example.com", password: hash });
            await user.save();
            services.jwt.generateToken.mockReturnValueOnce("example.token");

            const result = await api
                .post("/1.0/auth/login")
                .send({ email: "abel@example.com", password });

            expect(result.body).toSatisfySchemaInApiSpec("TokenResult");
            expect(result.status).toBe(200);
        });
    });
});
