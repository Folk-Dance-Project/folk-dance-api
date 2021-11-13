const { Model, DataTypes } = require("sequelize");

class AccessoryInstances extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                accessoryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "accessories",
                        key: "id",
                    },
                },
                groupId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "groups",
                        key: "id",
                    },
                },
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "users",
                        key: "id",
                    },
                },
                count: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 1,
                },
                // values for metadata defined in parent accessory
                properties: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    get() {
                        try {
                            return JSON.parse(this.metadata);
                        } catch (e) {
                            console.error(
                                "Could not parse properties for accessory_instance:",
                                this.id
                            );
                            return null;
                        }
                    },
                    set(value) {
                        this.metadata = JSON.stringify(value);
                    },
                },
            },
            {
                sequelize,
                tableName: "accessory_instances",
                underscored: true,
                charset: "utf8",
                paranoid: true,
                timestamps: true,
            }
        );
    }

    static associate() {}
}

module.exports = AccessoryInstances;
