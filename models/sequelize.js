const { Sequelize } = require("sequelize");

const { db: dbConfig } = require("../config");

const options = {
    host: dbConfig.host,
    dialect: "mysql",
    pool: {
        max: dbConfig.maxConnection,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    port: dbConfig.port,
    dialectOptions: {},
    logging: false,
};

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, options);

module.exports = sequelize;
