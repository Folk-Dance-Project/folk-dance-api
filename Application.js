const express = require("express");
const jsyaml = require("js-yaml");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

const cors = require("cors");
const registerOpenAPIRoutes = require("./api/registerOpenAPIRoutes");
const { NotFoundError } = require("./common/errors");
const errorHandler = require("./middleware/errorHandler");
const config = require("./config");

class Application {
    constructor({ dependencies }) {
        this.dependencies = dependencies;

        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.disable("x-powered-by");
        this.app.use(cors());
        this.app.use(
            express.json({
                limit: "50mb",
            })
        );
        this.app.use(
            express.urlencoded({
                extended: true,
                limit: "50mb",
                parameterLimit: 1000000,
            })
        );
    }

    setupRoutes() {
        const oasDoc = jsyaml.load(fs.readFileSync("api/openapi.yaml", "utf8"));
        registerOpenAPIRoutes(this.app, oasDoc, this.dependencies);

        this.app.get("/health", (req, res) => {
            res.status(StatusCodes.OK).end("OK");
        });

        this.app.use((req, res, next) => {
            next(new NotFoundError("No endpoint here"));
        });

        this.app.use(errorHandler);
    }

    async start() {
        const { sequelize } = this.dependencies.models;
        await sequelize.authenticate();
        await sequelize.sync();

        this.app.listen(config.port, () => {
            console.log("Listening on", config.port);
        });
    }

    get expressApp() {
        return this.app;
    }
}

module.exports = Application;
