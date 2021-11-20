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
                .send({ name: "test group create" });

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

    describe("PUT /1.0/groups/{groupId}/membership-requests", () => {
        test("response should match openApi schema", async () => {
            const group2 = await models.Groups.create({ name: "test group join" });
            const result = await api
                .put(`/1.0/groups/${group2.id}/membership-requests`)
                .set("Authorization", "Bearer asd");

            expect(result.body).toSatisfySchemaInApiSpec("GroupListItem");
            expect(result.status).toBe(200);
        });
    });
    describe("GET /1.0/groups/{groupId}/membership-requests", () => {
        test("response should match openApi schema", async () => {
            const member = await models.Users.create({
                name: "member",
                email: "member@example.com",
                password: "asdasd",
            });
            const group3 = await models.Groups.create({ name: "test group get requests" });
            await group3.addMember(1, {
                through: {
                    role: GROUP_MEMBERSHIP_ROLES.ADMIN,
                    status: GROUP_MEMBERSHIP_STATUS.APPROVED,
                },
            });
            await group3.addMember(member.id, {
                through: { status: GROUP_MEMBERSHIP_STATUS.PENDING },
            });
            const result = await api
                .get(`/1.0/groups/${group3.id}/membership-requests`)
                .set("Authorization", "Bearer asd");

            expect(result.body).toSatisfySchemaInApiSpec("MemberList");
            expect(result.status).toBe(200);
            expect(result.body.members.length).toBeGreaterThan(0);
        });
    });
});
