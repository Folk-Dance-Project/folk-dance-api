/**
 * @typedef {function({params: object, data: object}): Promise<any>} UseCase
 */

const Register = require("../use-cases/auth/Register");
const Login = require("../use-cases/auth/Login");
const GetGroups = require("../use-cases/groups/GetGroups");
const CreateGroup = require("../use-cases/groups/CreateGroup");
const GetGroupMembers = require("../use-cases/groups/GetGroupMembers");
const GetMembershipRequests = require("../use-cases/groups/GetMembershipRequests");
const RequestMembership = require("../use-cases/groups/RequestMembership");
const UpdateMembershipRequest = require("../use-cases/groups/UpdateMembershipRequest");
const GetAccessories = require("../use-cases/accessories/GetAccessories");
const CreateAccessory = require("../use-cases/accessories/CreateAccessory");

function configureUseCases({ models, services }) {
    const register = Register({ models, jwt: services.jwt });
    const login = Login({ models, jwt: services.jwt });
    const getGroups = GetGroups({ models });
    const createGroup = CreateGroup({ models });
    const getGroupMembers = GetGroupMembers({ models });
    const getMembershipRequests = GetMembershipRequests({ models });
    const requestMembership = RequestMembership({ models });
    const updateMembershipRequest = UpdateMembershipRequest({ models });
    const getAccessories = GetAccessories({ models });
    const createAccessory = CreateAccessory({ models });

    return {
        register,
        login,
        getGroups,
        createGroup,
        getGroupMembers,
        getMembershipRequests,
        requestMembership,
        updateMembershipRequest,
        getAccessories,
        createAccessory,
    };
}

module.exports = configureUseCases;
