"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const JwtValidatorDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

    type JwtValidationResult {
        validado: Boolean!
    }


    ##### Query #####

    type Query {
        validateJwt(jwt: String!): JwtValidationResult
    }
`;
exports.default = JwtValidatorDefs;
