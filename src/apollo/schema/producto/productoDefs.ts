import { gql } from "apollo-server-express"

const productoDefs = gql`
    ##### Tipos #####

    type Producto {
        _id: ID!
        nombre: String
        proveedor: String
        familia: String
        precioVenta: Float
        precioCompra: Float
        iva: Float
        margen: Float
        promociones: [String]
        ean: String
        cantidad: Int
        cantidadRestock: Int
        alta: Boolean
        img: String
        createdAt: String
        updatedAt: String
    }

    type ProductoMutationResponse {
        message: String!
        successful: Boolean!
    }

    input ProductoFind {
        _id: ID
        nombre: String
        ean: String
    }

    input ProductosFind {
        _ids: [ID!]
        nombre: String
        familia: String
        proveedor: String
        query: String
    }

    input ProductoAddInput {
        nombre: String!
        proveedor: String
        familia: String
        precioVenta: Float!
        precioCompra: Float!
        iva: Float!
        margen: Float!
        promociones: [String]
        ean: String!
        cantidad: Int
        cantidadRestock: Int
        alta: Boolean!
        img: String
    }

    input ProductoUpdateInput {
        _id: ID!
        nombre: String
        proveedor: String
        familia: String
        precioVenta: Float
        precioCompra: Float
        iva: Float
        margen: Float
        promociones: [String]
        ean: String
        cantidad: Int
        cantidadRestock: Int
        alta: Boolean
        img: String
    }


    ##### Query #####

    type Query {
        producto(find: ProductoFind!): Producto
        productos(find: ProductosFind, limit: Int): [Producto]
    }

    ##### Mutation #####
    
    type Mutation {
        addProducto(producto: ProductoAddInput!): ProductoMutationResponse!
        
        deleteProducto(_id: ID!): ProductoMutationResponse!
        
        updateProducto(producto: ProductoUpdateInput!): ProductoMutationResponse!
    }
`;

export default productoDefs