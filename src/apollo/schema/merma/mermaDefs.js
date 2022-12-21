"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const MermaDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

    type Merma {
        _id: ID!
        productos: [ProductoMermado],
        creadoPor: Empleado,
        costeProductos: Float,
        ventasPerdidas: Float,
        beneficioPerdido: Float,
        createdAt: String,
        updatedAt: String
    }

    type ProductoMermado {
        _id: ID
        nombre: String,
        proveedor: String,
        cantidad: Int,
        familia: String,
        margen: Float,
        ean: String,
        iva: Float,
        precioCompra: Float,
        precioVenta: Float,
        motivo: String,
    }

    type MermaMutationResponse {
        message: String!
        successful: Boolean!
    }

    input MermaFind {
        _id: ID!
    }

    input MermasFind {
        fechaInicial: String
        fechaFinal: String
        query: String
    }

    input MermaInput {
        productos: [ProductoMermadoInput]!
        empleadoId: String!
    }

    input ProductoMermadoInput {
        _id: String!
        cantidad: Int!
        motivo: String!
    }

    ##### Query #####

    type Query {
        merma(find: MermaFind!): Merma
        mermas(find: MermasFind, limit: Int): [Merma]
    }

    ##### Mutation #####
    
    type Mutation {
        addMerma(merma: MermaInput!): MermaMutationResponse!
        deleteMerma(_id: ID!): MermaMutationResponse!
        updateMerma(_id: ID!, merma: MermaInput!): MermaMutationResponse!
    }
`;
exports.default = MermaDefs;
