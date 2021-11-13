const OpenApiValidator = require("express-openapi-validator");
const swaggerWebUi = require("swagger-ui-express");
const express = require("express");

const EXPRESS_HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch"];

/**
 * Extract parameters from Express request object based on openApi spec
 * @param {e.Request} req
 * @return {{}}
 */
function getOpenApiParams(req) {
    const params = {};

    if (!Array.isArray(req.openapi.schema.parameters)) {
        return params;
    }
    for (const registeredParam of req.openapi.schema.parameters) {
        const getFrom = registeredParam.in === "path" ? "params" : registeredParam.in;

        params[registeredParam.name] = req[getFrom][registeredParam.name];
    }

    return params;
}

/**
 * @param {UseCase} useCase
 * @return {e.RequestHandler}
 */
function wrapUseCase(useCase) {
    return (req, res, next) => {
        const params = getOpenApiParams(req);
        let user = null;
        if (typeof req.user !== "undefined") {
            user = req.user;
        }

        try {
            const returned = useCase({ params, data: req.body, user, req });

            if (returned instanceof Promise) {
                returned.then((result) => res.json(result)).catch((e) => next(e));
                return;
            }
            res.json(returned);
        } catch (e) {
            next(e);
        }
    };
}

/**
 *
 * @param {Router} router
 * @param {OpenAPIV3.Document} oasDoc
 * @param {Object} useCases
 */
function wrapUseCases(router, oasDoc, useCases) {
    for (const path of Object.keys(oasDoc.paths)) {
        const pathObject = oasDoc.paths[path];
        for (const key of Object.keys(pathObject)) {
            if (!EXPRESS_HTTP_METHODS.includes(key)) {
                continue;
            }

            /** @type {OpenAPIV3.OperationObject} */
            const operation = pathObject[key];
            const useCase = useCases[operation.operationId];
            if (typeof useCase === "undefined") {
                // throw new Error(`Could not register operation: ${operation.operationId}`);
            }

            router[key](path, wrapUseCase(useCase));
        }
    }
}

/**
 * Register openAPI routes
 * @param {Express} app
 * @param {OpenAPIV3.Document} oasDoc
 * @param {Object} dependencies
 * @param {Object} dependencies.useCases
 * @param {Object} dependencies.middleware
 */
function registerOpenAPIRoutes(app, oasDoc, { useCases, middleware }) {
    app.use("/docs", swaggerWebUi.serve, (req, res, next) => {
        swaggerWebUi.setup(oasDoc)(req, res, next);
    });

    app.get("/openapi.json", (req, res) => {
        res.json(oasDoc);
    });

    app.use(
        OpenApiValidator.middleware({
            apiSpec: oasDoc,
            validateResponses: true,
            validateSecurity: {
                handlers: {
                    ApiKeyAuth: middleware.apiKeyAuth,
                },
            },
        })
    );

    const apiRouter = express.Router();
    wrapUseCases(apiRouter, oasDoc, useCases);
    app.use("/1.0", apiRouter);
}

module.exports = registerOpenAPIRoutes;
