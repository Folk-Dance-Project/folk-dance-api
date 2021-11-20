const { NotFoundError } = require("../../common/errors");

function DeleteAccessory({ models }) {
    return async function deleteAccessory({ params: { groupId, id } }) {
        const accessory = await models.Accessories.findOne({
            where: {
                id,
                groupId,
            },
        });
        if (!accessory) {
            throw new NotFoundError("acceessory not found");
        }

        await accessory.destroy();

        return {
            id: accessory.id,
            name: accessory.name,
            metadata: accessory.metadata,
        };
    };
}

module.exports = DeleteAccessory;
