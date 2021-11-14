const models = require("../../mocks/models");
const CreateGroup = require("../../../../use-cases/groups/CreateGroup");
const { ValidationError } = require("../../../../common/errors");
const { GROUP_MEMBERSHIP_ROLES, GROUP_MEMBERSHIP_STATUS } = require("../../../../common/constants");

const createGroup = CreateGroup({ models });

describe("CreateGroup", () => {
    test("should throw validation error if name is empty", async () => {
        const user = { id: 1 };
        const data = {
            name: " ",
        };

        const promise = createGroup({ data, user });

        await expect(promise).rejects.toBeInstanceOf(ValidationError);
    });
    test("should create the group", async () => {
        const user = { id: 1 };
        const data = {
            name: "group",
        };
        const group = { id: 1, name: data.name, membersCount: 1 };
        group.addMember = jest.fn();
        models.Groups.create.mockReturnValueOnce(group);

        await createGroup({ data, user });

        expect(models.Groups.create).toHaveBeenCalledWith(
            expect.objectContaining({ name: data.name })
        );
    });
    test("should assign current user to it as admin", async () => {
        const user = { id: 1 };
        const data = {
            name: "group",
        };
        const group = { id: 1, name: data.name, membersCount: 1 };
        group.addMember = jest.fn();
        models.Groups.create.mockReturnValueOnce(group);

        await createGroup({ data, user });

        expect(group.addMember).toHaveBeenCalledWith(
            user.id,
            expect.objectContaining({
                through: expect.objectContaining({
                    role: GROUP_MEMBERSHIP_ROLES.ADMIN,
                    status: GROUP_MEMBERSHIP_STATUS.APPROVED,
                }),
            })
        );
    });
});
