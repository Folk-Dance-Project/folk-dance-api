/**
 * @typedef {function({params: object, data: object}): Promise<any>} UseCase
 */

const Register = require("../use-cases/auth/Register");
const Login = require("../use-cases/auth/Login");
const GetGroups = require("../use-cases/groups/GetGroups");
const CreateGroup = require("../use-cases/groups/CreateGroup");
const GetGroupMembers = require("../use-cases/groups/GetGroupMembers");
const RequestMembership = require("../use-cases/groups/RequestMembership");

function configureUseCases({ models, services }) {
    const register = Register({ models, jwt: services.jwt });
    const login = Login({ models, jwt: services.jwt });
    const getGroups = GetGroups({ models });
    const createGroup = CreateGroup({ models });
    const getGroupMembers = GetGroupMembers({ models });
    const requestMembership = RequestMembership({ models });

    return {
        register,
        login,
        getGroups,
        createGroup,
        getGroupMembers,
        requestMembership,
    };
}

module.exports = configureUseCases;
