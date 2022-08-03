import { gql } from "apollo-server-express"

const JwtValidatorDefs = gql`
    ##### Tipos #####

    type JwtValidationResult {
        validado: Boolean!
    }


    ##### Query #####

    type Query {
        validateJwt(jwt: String!): JwtValidationResult
    }
`;

export default JwtValidatorDefs;