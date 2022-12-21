"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const ProveedorDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####
    
    type Contacto {
        nombre: String,
        telefono: String
        email: String,
    }

    type Prooveedor {
        _id: ID!
        nombre: String
        direccion: String
        localidad: String
        provincia: String
        cp: String
        pais: String
        telefono: String
        email:String
        contacto: Contacto 
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
        contacto: ContactoInput
        cif: String
    }

    input ContactoInput {
        nombre: String,
        telefono: String
        email: String,
    }

    input ProveedorFind {
        query: String
    }

    type ProveedorMutationResponse {
        message: String
        successful: Boolean
        data: [Prooveedor]
    }


    ##### Query #####

    type Query {        
        proveedores(find: ProveedorFind, limit: Int): [Prooveedor]!
    }

    ##### Mutation #####
    
    type Mutation {
        addProveedor(fields: ProveedorInput!): ProveedorMutationResponse!
        deleteProveedor(_id: ID!): ProveedorMutationResponse!
        updateProveedor(_id: ID!, proveedorInput: ProveedorInput!): ProveedorMutationResponse!
    }
`;
exports.default = ProveedorDefs;
