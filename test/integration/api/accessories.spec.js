const { api, models, initUser } = require("../setup");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../../../common/constants");

describe("Accessories API", () => {
    beforeAll(async () => {
        const user = await initUser();
        const group = await models.Groups.create({ name: "test group" });
        await group.addMember(user, {
            through: {
                role: GROUP_MEMBERSHIP_ROLES.MEMBER,
                status: GROUP_MEMBERSHIP_STATUS.APPROVED,
            },
        });
        await models.Accessories.create({
            name: "boots",
            groupId: group.id,
            metadata: [
                {
                    name: "size",
                    type: "number",
                },
            ],
        });
    });

    afterAll(async () => {
        await models.sequelize.truncate();
    });

    describe("GET /1.0/groups/{groupId}/accessories", () => {
        test("response should match openApi schema", async () => {
            const result = await api
                .get("/1.0/groups/1/accessories")
                .set("Authorization", "Bearer asd");

            expect(result.body).toSatisfySchemaInApiSpec("AccessoriesList");
            expect(result.status).toBe(200);
            expect(result.body.total).toBeGreaterThan(0);
        });
    });
});
