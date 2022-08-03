import { gql } from "apollo-server-express"

const LoginDefs = gql`
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

export default LoginDefs;