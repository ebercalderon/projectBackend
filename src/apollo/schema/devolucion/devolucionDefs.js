"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const DevolucionDefs = (0, apollo_server_express_1.gql) `
    ##### Tipos #####

    type Devolucion {
        _id: ID!
        productosDevueltos: [ProductoDevuelto]
        dineroDevuelto: Float
        ventaOriginal: Venta
        tpv: ID
        cliente: Cliente
        trabajador: Empleado
        modificadoPor: Empleado
        createdAt: String
        updatedAt: String
    }

    type ProductoDevuelto {
        _id: ID!
        nombre: String
        proveedor: String
        familia: String
        precioVenta: Float
        precioCompra: Float
        precioFinal: Float
        iva: Float
        margen: Float
        ean: String
        cantidadDevuelta: Int
        dto: Float
    }

    input ProductoDevueltoInput {
        _id: ID!
        nombre: String
        proveedor: String
        familia: String
        precioVenta: Float
        precioCompra: Float
        precioFinal: Float
        iva: Float
        margen: Float
        ean: String
        cantidadDevuelta: Int
        dto: Float
    }

    input DevolucionFind {
        _ids: [ID!]
        clienteId: String
        vendedorId: String
        createdAt: String
        fechaInicial: String
        fechaFinal: String
        tpv: ID
        query: String
    }

    input ClienteInput {
        _id: ID!
        nif: String!
        nombre: String!
        calle: String!
        cp: String!
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

    input DevolucionFields {
        productosDevueltos: [ProductoDevueltoInput]!
        ventaId: ID!
        tpv: ID!
        clienteId: ID!
        trabajadorId: ID!
        modificadoPorId: ID!
    }

    type DevolucionMutationResponse {
        _id: String
        message: String!
        successful: Boolean!
        createdAt: String
    } 

    ##### Query #####

    type Query {        
        devolucion(_id: ID!): Devolucion
        devoluciones(find: DevolucionFind, limit: Int, order: String, offset: Int): [Devolucion]
    }

    ##### Mutation #####
    
    type Mutation {
        addDevolucion(fields: DevolucionFields!): DevolucionMutationResponse!
        
        deleteDevolucion(_id: ID!): DevolucionMutationResponse!
        
        updateDevolucion(_id: ID!, productos: [ProductoVendidoInput], dineroEntregadoEfectivo: Float, descuentoPorcentaje: Float, precioVentaTotal: Float!, cambio: Float,
        clienteId: ClienteInput, vendidoPor: EmpleadoInput, modificadoPor: EmpleadoInput, tipo: String, descuentoEfectivo: Float): DevolucionMutationResponse!
    }
`;
exports.default = DevolucionDefs;
