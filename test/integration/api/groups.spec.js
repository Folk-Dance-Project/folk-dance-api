const { api, models, initUser } = require("../setup");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../../../common/constants");

describe("Groups API", () => {
    beforeAll(async () => {
        const user = await initUser();
        const group = await models.Groups.create({ name: "test group" });
        await group.addMember(user, {
            through: {
                role: GROUP_MEMBERSHIP_ROLES.MEMBER,
                status: GROUP_MEMBERSHIP_STATUS.APPROVED,
            },
        });
    });

    afterAll(async () => {
        await models.sequelize.truncate();
    });

    describe("GET /1.0/groups", () => {
        test("response should match openApi schema", async () => {
            const result = await api.get("/1.0/groups").set("Authorization", "Bearer asd");

            expect(result.body).toSatisfySchemaInApiSpec("GroupList");
            expect(result.status).toBe(200);
            expect(result.body.total).toBeGreaterThan(0);
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

    describe("GET /1.0/groups/{groupId}/members", () => {
        test("response should match openApi schema", async () => {
            const result = await api
                .get("/1.0/groups/1/members")
                .set("Authorization", "Bearer asd");

            expect(result.body).toSatisfySchemaInApiSpec("MemberList");
            expect(result.status).toBe(200);
            expect(result.body.total).toBeGreaterThan(0);
        });
    });
});
