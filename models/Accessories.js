const { Model, DataTypes } = require("sequelize");

class Accessories extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                groupId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "groups",
                        key: "id",
                    },
                },
                metadata: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    get() {
                        try {
                            return JSON.parse(this.getDataValue("metadata"));
                        } catch (e) {
                            console.error("Could not parse metadata for accessory:", this.id);
                            return null;
                        }
                    },
                    set(value) {
                        this.setDataValue("metadata", JSON.stringify(value));
                    },
                },
            },
            {
                sequelize,
                tableName: "accessories",
                underscored: true,
                charset: "utf8",
                timestamps: true,
                paranoid: true,
            }
        );
    }

    static associate() {}
}

module.exports = Accessories;
