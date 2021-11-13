const { Op } = require("sequelize");
const models = require("../../mocks/models");
const GetGroups = require("../../../../use-cases/groups/GetGroups");

const getGroups = GetGroups({ models });

describe("GetGroups", () => {
    test("searches by name if parameter is provided", async () => {
        const params = {
            name: "wow",
        };
        models.Groups.findAndCountAll.mockReturnValueOnce({ count: 0, rows: [] });

        await getGroups({ params });

        expect(models.Groups.findAndCountAll).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ [Op.like]: params.name }) })
        );
    });
    test("returns a list of groups", async () => {
        const params = {
            name: "wow",
        };
        models.Groups.findAndCountAll.mockReturnValueOnce({
            count: 1,
            rows: [{ id: 1, name: "asd", membersCount: 0 }],
        });

        const { total, groups } = await getGroups({ params });

        expect(models.Groups.findAndCountAll).toHaveBeenCalled();
        expect(groups.length).toBe(total);
    });
});
