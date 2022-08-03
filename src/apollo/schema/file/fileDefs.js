"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const fileDefs = (0, apollo_server_express_1.gql) `
    type ResponseMutation {
      message: String!
      successful: Boolean!
  }

  type Mutation {
    addProductosFile(csv: String!): ResponseMutation!
    addClientesFile(csv: String!): ResponseMutation!
    addVentasFile(ventasJson: String!): ResponseMutation!
    addCierresFile(csv: String!):  ResponseMutation!
  }
`;
exports.default = fileDefs;
