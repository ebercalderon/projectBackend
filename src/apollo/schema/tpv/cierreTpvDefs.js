"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const cierreTpvDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

    type CierreTPV {
        _id: ID!,
        tpv: ID!,
        cajaInicial: Float,
        abiertoPor: Empleado,
        cerradoPor: Empleado,
        apertura: String,
        cierre: String,
        ventasEfectivo: Float,
        ventasTarjeta: Float,
        ventasTotales: Float,
        dineroEsperadoEnCaja: Float,
        dineroRealEnCaja: Float,
        dineroRetirado:Float,
        fondoDeCaja: Float,
        beneficio: Float,
        nota: String
    }

    input CierreTPVInput {
        _id: ID,
        tpv: ID!,
        cajaInicial: Float!,
        abiertoPor: EmpleadoInput!,
        cerradoPor: EmpleadoInput!,
        apertura: String!,
        cierre: String,
        ventasEfectivo: Float!,
        ventasTarjeta: Float!,
        ventasTotales: Float!,
        dineroEsperadoEnCaja: Float!,
        dineroRealEnCaja: Float!,
        dineroRetirado:Float!,
        fondoDeCaja: Float!,
        nota: String,
    }

    input EmpleadoInput {
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

    type CierreTPVMutationResponse {
        message: String!
        successful: Boolean!
        token: String
        cierre: CierreTPV
    }

    input CierreTPVFind {
        _id: ID
    }

    input CierresTPVFind {
        apertura: String
        fechaInicial: String
        fechaFinal: String
        query: String
    }

    ##### Query #####

    type Query {
        cierreTPV(find: CierreTPVFind!): CierreTPV
        cierresTPVs(find: CierresTPVFind, limit: Int): [CierreTPV]
    }

    ##### Mutation #####
    
    type Mutation {
        addCierreTPV(cierre: CierreTPVInput!): CierreTPVMutationResponse!        
        deleteCierreTPV(_id: ID!): TPVMutationResponse!        
        updateCierreTPV(cierre: CierreTPVInput): CierreTPVMutationResponse!
    }
`;
exports.default = cierreTpvDefs;
