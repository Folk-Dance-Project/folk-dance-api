const { ValidationError } = require("../../common/errors");

function CreateAccessory({ models }) {
    return async function createAccessory({ params: { groupId }, data: { name, metadata } }) {
        if (!name.trim()) {
            throw new ValidationError("name is required");
        }

        const accessory = await models.Accessories.create({ name, groupId, metadata });

        return {
            id: accessory.id,
            name: accessory.name,
            metadata: accessory.metadata,
        };
    };
}

module.exports = CreateAccessory;
