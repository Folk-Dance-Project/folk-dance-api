const crypto = require("crypto");

const models = require("../../mocks/models");
const Login = require("../../../../use-cases/auth/Login");
const { ValidationError } = require("../../../../common/errors");

const jwt = require("../../../../services/jwt");

jest.mock("../../../../services/jwt");
const login = Login({ models, jwt });

describe("Login", () => {
    test("returns bad request error if user not found with email", async () => {
        const data = {
            email: "abel@example.com",
            password: "123123",
        };

        models.Users.findOne.mockReturnValueOnce(null);

        const promise = login({ data });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
        expect(models.Users.findOne).toHaveBeenCalled();
    });
    test("returns bad request error password does not match", async () => {
        const data = {
            email: "abel@example.com",
            password: "123123",
        };
        models.Users.findOne.mockReturnValueOnce({ email: data.email, password: "nomatch" });

        const promise = login({ data });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
        expect(models.Users.findOne).toHaveBeenCalled();
    });
    test("returns an access token if successful", async () => {
        const data = {
            email: "abel@example.com",
            password: "123123",
        };
        const mockToken = "token";
        jwt.generateToken.mockReturnValueOnce(mockToken);
        const passwordHash = crypto
            .createHash("sha1")
            .update(data.password)
            .digest()
            .toString("base64");
        models.Users.findOne.mockReturnValueOnce({
            id: 1,
            email: data.email,
            password: passwordHash,
        });

        const { token } = await login({ data });

        expect(models.Users.findOne).toHaveBeenCalled();
        expect(jwt.generateToken).toHaveBeenCalled();
        expect(token).toEqual(mockToken);
    });
});
