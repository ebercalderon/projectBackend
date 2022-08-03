import { gql } from "apollo-server-express"

const ProveedorDefs = gql`
    ##### Tipos #####

    type ProoveedorType {
        _id: ID!
        nombre: String
        direccion: String
        localidad: String
        provincia: String
        cp: String
        pais: String
        telefono: String
        email:String
        contacto: String
        createdAt: String
        updatedAt: String
        cif: String
    }

    input ProveedorInput {
        nombre: String
        direccion: String
        localidad: String
        provincia: String
        cp: String
        pais: String
        telefono: String
        email:String
        contacto: String
        createdAt: String
        updatedAt: String
        cif: String
    }

    input ProveedorFind {
        query: String
    }

    type ProveedorMutationResponse {
        message: String
        successful: Boolean
        data: [ProoveedorType]
    }


    ##### Query #####

    type Query {        
        proveedores(find: ProveedorFind, limit: Int): [ProoveedorType]!
    }

    ##### Mutation #####
    
    type Mutation {
        addProveedor(fields: ProveedorInput!): ProveedorMutationResponse!
        deleteProveedor(_id: ID!): ProveedorMutationResponse!
        updateProveedor(_id: ID!, proveedorInput: ProveedorInput!): ProveedorMutationResponse!
    }
`;

export default ProveedorDefs