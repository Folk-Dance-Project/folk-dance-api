const crypto = require("crypto");

const { ValidationError } = require("../../common/errors");

function Register({ models, jwt }) {
    return async function register({ data: { email, name, password, groupId = null } }) {
        const existing = await models.Users.findOne({
            attributes: ["id"],
            where: {
                email,
            },
            raw: true,
        });

        if (existing !== null) {
            throw new ValidationError("Email address already in use.");
        }

        if (password.length < 6) {
            throw new ValidationError("Password should be at least 6 characters");
        }

        if (password.length > 32) {
            throw new ValidationError("Password is too long");
        }

        if (!name.trim()) {
            throw new ValidationError("Name is required");
        }

        const passwordHash = crypto.createHash("sha1").update(password).digest().toString("base64");

        const created = await models.Users.create({
            email,
            name: name.trim(),
            password: passwordHash,
        });
        const token = await jwt.generateToken({
            id: created.id,
            apiKeyVersion: created.apiKeyVersion,
        });

        // TODO request membership

        return { token };
    };
}

module.exports = Register;
