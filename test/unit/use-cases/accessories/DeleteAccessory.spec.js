const models = require("../../mocks/models");
const DeleteAccessory = require("../../../../use-cases/accessories/DeleteAccessory");
const { NotFoundError } = require("../../../../common/errors");

const deleteAccessory = DeleteAccessory({ models });

describe("DeleteAccessory", () => {
    test("should throw not found error if accessory not found", async () => {
        const params = {
            groupId: 1,
            id: 1,
        };
        models.Accessories.findOne.mockReturnValueOnce(null);

        const promise = deleteAccessory({ params });

        await expect(promise).rejects.toBeInstanceOf(NotFoundError);
        expect(models.Accessories.findOne).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ id: params.id, groupId: params.groupId }),
            })
        );
    });
    test("should delete accessory", async () => {
        const params = {
            groupId: 1,
            id: 1,
        };
        const accessory = {
            id: 1,
            name: "test",
            metadata: null,
            destroy: jest.fn(),
        };
        models.Accessories.findOne.mockReturnValueOnce(accessory);

        await deleteAccessory({ params });

        expect(models.Accessories.findOne).toHaveBeenCalled();
        expect(accessory.destroy).toHaveBeenCalled();
    });
});
