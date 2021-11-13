const { Model, DataTypes } = require("sequelize");

class Users extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                apiKeyVersion: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
            },
            {
                sequelize,
                tableName: "users",
                underscored: true,
                charset: "utf8",
                paranoid: true,
                timestamps: true,
            }
        );
    }

    static associate({ Groups, GroupMemberships }) {
        Users.belongsToMany(Groups, { through: GroupMemberships });
    }
}
module.exports = Users;
