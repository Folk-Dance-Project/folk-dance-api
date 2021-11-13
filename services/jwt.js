const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * @typedef {Object} JWTPayload
 * @property {number} id
 * @property {number} apiKeyVersion
 */

/**
 * Generate a JWT token for a user
 * @param {JWTPayload} payload
 * @param {string} expiration
 * @return {Promise<string>}
 */
async function generateToken(payload, expiration = "1h") {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, config.jwt.secret, { expiresIn: expiration }, (err, encoded) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(encoded);
        });
    });
}

/**
 * Decode a JWT token
 * @param {string} token
 * @return {Promise<JWTPayload>}
 */
async function decodeToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.jwt.secret, (err, payload) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(payload);
        });
    });
}

module.exports = {
    generateToken,
    decodeToken,
};
