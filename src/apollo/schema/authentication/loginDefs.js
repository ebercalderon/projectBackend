"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const LoginDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

    type LoginResult {
        message: String!
        successful: Boolean!
        token: String
    }

    input Credentials {
        email: String!
        password: String!
    }

    ##### Query #####

    type Query {
        login(loginValues: Credentials!): LoginResult
    }
`;
exports.default = LoginDefs;
