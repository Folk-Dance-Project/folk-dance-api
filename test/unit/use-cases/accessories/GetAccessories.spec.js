const models = require("../../mocks/models");
const GetAccessories = require("../../../../use-cases/accessories/GetAccessories");

const getAccessories = GetAccessories({ models });

describe("GetAccessories", () => {
    test("returns a list and number of accessories", async () => {
        models.Accessories.findAndCountAll.mockReturnValueOnce({
            count: 1,
            rows: [{ id: 1, name: "boots", metadata: [{ name: "size", type: "number" }] }],
        });
        const { total, accessories } = await getAccessories({ params: { groupId: 1 } });
        expect(models.Accessories.findAndCountAll).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ groupId: 1 }) })
        );
        expect(total).toBe(1);
        expect(accessories.length).toBe(1);
    });
});
