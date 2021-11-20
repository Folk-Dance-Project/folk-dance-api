const models = require("../../mocks/models");
const CreateAccessory = require("../../../../use-cases/accessories/CreateAccessory");
const { ValidationError } = require("../../../../common/errors");

const createAccessory = CreateAccessory({ models });

describe("CreateAccessory", () => {
    test("throws bad request error if name is empty", async () => {
        const params = {
            groupId: 1,
        };
        const data = {
            name: " ",
            metadata: [],
        };

        const promise = createAccessory({ params, data });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
    });
    test("stores and returns accessory", async () => {
        const params = {
            groupId: 1,
        };
        const data = {
            name: "csizma",
            metadata: [
                {
                    name: "size",
                    type: "string",
                },
            ],
        };
        models.Accessories.create.mockReturnValueOnce({ ...data, id: 1 });

        const created = await createAccessory({ params, data });

        expect(models.Accessories.create).toHaveBeenCalled();
        expect(created.id).toEqual(1);
    });
});
