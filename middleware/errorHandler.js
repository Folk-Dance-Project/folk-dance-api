const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { APIError } = require("../common/errors");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    // only show errors that we wanted to show the user anyway
    if (err instanceof APIError) {
        res.status(err.statusCode).json({
            code: err.statusCode,
            message: err.message,
        });
        return;
    }

    // handle express openapi validator errors
    if (typeof err.status === "number") {
        if (err.status === StatusCodes.INTERNAL_SERVER_ERROR) {
            console.error(err);
        }
        res.status(err.status).json({
            code: err.status,
            message: err.message,
        });
        return;
    }

    // log full error in case of 500 errors
    console.error(err);

    // default error handler for api endpoints
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
}
module.exports = errorHandler;
