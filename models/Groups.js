const { Model, DataTypes } = require("sequelize");

class Groups extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                membersCount: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                tableName: "groups",
                underscored: true,
                charset: "utf8",
                paranoid: true,
                timestamps: true,
            }
        );
    }

    static associate({ Users, GroupMemberships, Accessories }) {
        Groups.belongsToMany(Users, { through: GroupMemberships, as: "members" });
        Groups.hasMany(Accessories, { foreignKey: "groupId" });
    }
}

module.exports = Groups;
