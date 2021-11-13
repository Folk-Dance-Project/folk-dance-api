const crypto = require("crypto");

const models = require("../../mocks/models");
const jwt = require("../../../../services/jwt");

jest.mock("../../../../services/jwt");
const EXAMPLE_TOKEN = "example.token";
jwt.generateToken.mockReturnValue(EXAMPLE_TOKEN);

const { ValidationError } = require("../../../../common/errors");
const Register = require("../../../../use-cases/auth/Register");

const register = Register({ models, jwt });

describe("Register", () => {
    test("fails if email address already in use", async () => {
        models.Users.findOne.mockReturnValueOnce({});
        const email = "abel@example.com";
        const password = "password";

        const promise = register({ data: { email, password } });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
        expect(models.Users.findOne).toHaveBeenLastCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ email }),
            })
        );
    });
    test("fails if password is too short", async () => {
        models.Users.findOne.mockReturnValueOnce(null);
        const email = "abel@example.com";
        const password = "pass";

        const promise = register({ data: { email, password } });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
    });
    test("fails if password is too long", async () => {
        models.Users.findOne.mockReturnValueOnce(null);
        const email = "abel@example.com";
        const password = Array.from({ length: 100 }, () => "pass").join("");
        const promise = register({ data: { email, password } });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
    });
    test("creates user and returns an access token", async () => {
        const id = 1;
        const email = "abel@example.com";
        const name = "abel";
        const password = "password  ";
        const passwordHash = crypto.createHash("sha1").update(password).digest().toString("base64");

        models.Users.findOne.mockReturnValueOnce(null);
        models.Users.create.mockReturnValueOnce({ id, email, password, name });

        const { token } = await register({ data: { email, password, name } });

        expect(models.Users.create).toHaveBeenCalledWith({ email, password: passwordHash, name });
        expect(jwt.generateToken).toHaveBeenCalledWith({ id });
        expect(token).toBe(EXAMPLE_TOKEN);
    });
});
