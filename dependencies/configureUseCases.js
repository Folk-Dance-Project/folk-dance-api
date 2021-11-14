/**
 * @typedef {function({params: object, data: object}): Promise<any>} UseCase
 */

const Register = require("../use-cases/auth/Register");
const Login = require("../use-cases/auth/Login");
const GetGroups = require("../use-cases/groups/GetGroups");
const CreateGroup = require("../use-cases/groups/CreateGroup");
const GetGroupMembers = require("../use-cases/groups/GetGroupMembers");

function configureUseCases({ models, services }) {
    const register = Register({ models, jwt: services.jwt });
    const login = Login({ models, jwt: services.jwt });
    const getGroups = GetGroups({ models });
    const createGroup = CreateGroup({ models });
    const getGroupMembers = GetGroupMembers({ models });

    return {
        register,
        login,
        getGroups,
        createGroup,
        getGroupMembers,
    };
}

module.exports = configureUseCases;
