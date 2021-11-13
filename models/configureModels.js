const Users = require("./Users");
const Groups = require("./Groups");
const GroupMemberships = require("./GroupMemberships");
const Accessories = require("./Accessories");
const AccessoryInstances = require("./AccessoryInstances");

function configureModels(sequelize) {
    Users.init(sequelize);
    Groups.init(sequelize);
    GroupMemberships.init(sequelize);
    Accessories.init(sequelize);
    AccessoryInstances.init(sequelize);

    const { models } = sequelize;

    for (const modelName of Object.keys(models)) {
        sequelize.models[modelName].associate(sequelize.models);
    }

    return { Users, Groups, GroupMemberships, Accessories, AccessoryInstances, sequelize };
}

module.exports = configureModels;
