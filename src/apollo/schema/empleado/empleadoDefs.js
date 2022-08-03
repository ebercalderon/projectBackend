"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const EmpleadoDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

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

    type EmpleadoMutationResponse {
        message: String!
        successful: Boolean!
    }

    input EmpleadoInputFields {
        nombre: String!, 
        apellidos: String!, 
        dni: String!, 
        rol: String!, 
        email: String!,
        password: String!
    }

    input EmpleadoUpdateFields {
        nombre: String, 
        apellidos: String, 
        dni: String, 
        rol: String, 
        email: String,
        password: String
    }

    input EmpleadoFind {
        _id: ID
        nombre: String
        dni: String
    }

    input EmpleadosFind {
        _ids: [ID!]
        nombre: String
        rol: String
        query: String
    }

    ##### Query #####

    type Query {        
        empleado(find: EmpleadoFind!): Empleado
        empleados(find: EmpleadosFind, limit: Int): [Empleado]
    }

    ##### Mutation #####
    
    type Mutation {
        addEmpleado(empleadoInput: EmpleadoInputFields!): EmpleadoMutationResponse!,
        deleteEmpleado(_id: ID!): EmpleadoMutationResponse!,
        updateEmpleado(_id: ID!, empleadoInput: EmpleadoUpdateFields!): EmpleadoMutationResponse!,
    }
`;
exports.default = EmpleadoDefs;
