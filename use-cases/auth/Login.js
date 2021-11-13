const crypto = require("crypto");
const { ValidationError } = require("../../common/errors");

function Login({ models, jwt }) {
    return async function login({ data: { email, password } }) {
        const user = await models.Users.findOne({ where: { email } });
        if (!user) {
            throw new ValidationError("Invalid email");
        }
        const passwordHash = crypto.createHash("sha1").update(password).digest().toString("base64");
        if (user.password !== passwordHash) {
            throw new ValidationError(`Invalid password`);
        }

        // TODO invalidate
        const token = await jwt.generateToken({ id: user.id, apiKeyVersion: user.apiKeyVersion });

        return { token };
    };
}

module.exports = Login;
