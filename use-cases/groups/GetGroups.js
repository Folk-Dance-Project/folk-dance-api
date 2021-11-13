const { Op } = require("sequelize");

function GetGroups({ models }) {
    return async function getGroups({ params: { offset = 0, limit = 100, name = null } }) {
        const where = {};
        if (name !== null) {
            where.name = {
                [Op.like]: name,
            };
        }

        const { count: total, rows: groups } = await models.Groups.findAndCountAll({
            attributes: ["id", "name", "membersCount"],
            where,
            offset,
            limit,
            raw: true,
        });

        return {
            total,
            groups: groups.map((g) => ({
                id: g.id,
                name: g.name,
                membersCount: g.membersCount,
            })),
        };
    };
}

module.exports = GetGroups;
