import { gql } from "apollo-server-express";

const fileDefs = gql`
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

export default fileDefs;