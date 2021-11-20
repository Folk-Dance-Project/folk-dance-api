function GetAccessories({ models }) {
    return async function getAccessories({ params: { offset = 0, limit = 100, groupId } }) {
        const { count: total, rows: accessories } = await models.Accessories.findAndCountAll({
            where: {
                groupId,
            },
            offset,
            limit,
        });

        return {
            total,
            accessories: accessories.map((e) => ({
                id: e.id,
                name: e.name,
                metadata: e.metadata,
            })),
        };
    };
}

module.exports = GetAccessories;
