"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const tpvDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

    type TPV {
        _id: ID!
        nombre: String
        enUsoPor: Empleado
        libre: Boolean
        cajaInicial: Float
        createdAt: String
        updatedAt: String
    }

    type Empleado {
        _id: ID!
        nombre: String!
        apellidos: String!
        dni: String
        rol: String!
        genero: String
        email: String!
        horasPorSemana: Float
        fechaAlta: String
    }

    type TPVMutationResponse {
        message: String!
        successful: Boolean!
    }

    type TPVMutationJwtResponse {
        token: String!
        successful: Boolean
    }

    input TPVFind {
        _id: ID
        nombre: String
        empleadoId: ID
    }

    input TPVsFind {
        libre: Boolean!
    }


    ##### Query #####

    type Query {
        tpv(find: TPVFind!): TPV
        tpvs(find: TPVsFind, limit: Int): [TPV]
    }

    ##### Mutation #####
    
    type Mutation {
        addTPV(nombre: String!, enUsoPor: ID, libre: Boolean, cajaInicial: Int): TPVMutationResponse!
        
        deleteTPV(_id: ID!): TPVMutationResponse!
        
        updateTPV(_id: ID!, nombre: String, enUsoPor: ID, libre: Boolean, cajaInicial: Int): TPVMutationResponse!

        ocupyTPV(idEmpleado: ID!, idTPV: ID!, cajaInicial: Float!): TPVMutationJwtResponse!
        
        freeTPV(idEmpleado: ID!, idTPV: ID!): TPVMutationJwtResponse!
    }
`;
exports.default = tpvDefs;
