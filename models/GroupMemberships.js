const { Model, DataTypes } = require("sequelize");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../common/constants");

class GroupMemberships extends Model {
    static init(sequelize) {
        super.init(
            {
                role: {
                    type: DataTypes.ENUM(...Object.values(GROUP_MEMBERSHIP_ROLES)),
                    allowNull: false,
                    defaultValue: GROUP_MEMBERSHIP_ROLES.MEMBER,
                },
                status: {
                    type: DataTypes.ENUM(...Object.values(GROUP_MEMBERSHIP_STATUS)),
                    allowNull: false,
                    defaultValue: GROUP_MEMBERSHIP_STATUS.PENDING,
                },
            },
            {
                sequelize,
                tableName: "group_memberships",
                charset: "utf8",
                underscored: true,
                paranoid: false,
                timestamps: true,
            }
        );
    }

    static associate() {}
}

module.exports = GroupMemberships;
