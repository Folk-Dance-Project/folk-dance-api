/* eslint-disable max-classes-per-file */
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

class APIError extends Error {
    constructor(message = "", statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message || ReasonPhrases.INTERNAL_SERVER_ERROR);
        this.statusCode = statusCode;
    }
}

class ValidationError extends APIError {
    constructor(message = "") {
        super(message || ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST);
    }
}

class NotFoundError extends APIError {
    constructor(message = "") {
        super(message || ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND);
    }
}

class UnauthorizedError extends APIError {
    constructor(message = "") {
        super(message || ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED);
    }
}

class ForbiddenError extends APIError {
    constructor(message = "") {
        super(message || ReasonPhrases.FORBIDDEN, StatusCodes.FORBIDDEN);
    }
}

module.exports = {
    APIError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
};
