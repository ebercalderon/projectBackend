"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductoResolver = exports.deleteProductoResolver = exports.addProductoResolver = exports.productosResolver = exports.productoResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../../../databases/database");
const productoResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (!args.find._id && !args.find.nombre && !args.find.ean)
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Find no puede estar vacío');
    const db = database_1.Database.Instance();
    if (args.find._id) {
        const producto = yield db.ProductDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
        if (producto)
            return producto;
    }
    if (args.find.nombre) {
        const producto = yield db.ProductDBController.CollectionModel.findOne({
            nombre: {
                "$regex": args.find.nombre, "$options": "i"
            }
        }).exec();
        if (producto)
            return producto;
    }
    if (args.find.ean) {
        const producto = yield db.ProductDBController.CollectionModel.findOne({ ean: args.find.ean }).exec();
        if (producto)
            return producto;
    }
    return null;
});
exports.productoResolver = productoResolver;
const productosResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const db = database_1.Database.Instance();
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const productos = yield db.ProductDBController.CollectionModel.find()
            .limit(args.limit || 150)
            .exec();
        return productos;
    }
    if ((_a = args.find) === null || _a === void 0 ? void 0 : _a._ids) {
        const productos = yield db.ProductDBController.CollectionModel.find({ _id: args.find._ids })
            .limit(args.limit || 150)
            .exec();
        return productos;
    }
    if ((_b = args.find) === null || _b === void 0 ? void 0 : _b.nombre) {
        const productos = yield db.ProductDBController.CollectionModel.find({ nombre: { "$regex": args.find.nombre, "$options": "i" } })
            .limit(args.limit || 150)
            .exec();
        return productos;
    }
    if ((_c = args.find) === null || _c === void 0 ? void 0 : _c.familia) {
        const productos = yield db.ProductDBController.CollectionModel.find({ familia: { "$regex": args.find.familia, "$options": "i" } })
            .limit(args.limit || 150)
            .exec();
        return productos;
    }
    if ((_d = args.find) === null || _d === void 0 ? void 0 : _d.proveedor) {
        const productos = yield db.ProductDBController.CollectionModel.find({ proveedor: { "$regex": args.find.proveedor, "$options": "i" } })
            .limit(args.limit || 150)
            .exec();
        return productos;
    }
    if ((_e = args.find) === null || _e === void 0 ? void 0 : _e.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(query);
        let productos = {};
        if (isQueryValidId) {
            productos = yield db.ProductDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();
        }
        else {
            productos = yield db.ProductDBController.CollectionModel.find({
                $or: [
                    { nombre: { "$regex": query, "$options": "i" } },
                    { familia: { "$regex": query, "$options": "i" } },
                    { ean: { "$regex": query, "$options": "i" } },
                    { proveedor: { "$regex": query, "$options": "i" } }
                ]
            })
                .limit(args.limit || 150)
                .exec();
        }
        return productos;
    }
    return [];
});
exports.productosResolver = productosResolver;
const addProductoResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const producto = yield db.ProductDBController.CollectionModel.exists({ ean: args.producto.ean });
    if (producto !== null) {
        return { message: "El código EAN está en uso", successful: false };
    }
    const existeNombre = yield db.ProductDBController.CollectionModel.find({ nombre: args.producto.nombre });
    if (existeNombre.length > 0) {
        return { message: "El nombre del producto está en uso", successful: false };
    }
    const updatedProduct = new db.ProductDBController.CollectionModel({
        nombre: args.producto.nombre,
        proveedor: args.producto.proveedor,
        familia: args.producto.familia,
        precioVenta: args.producto.precioVenta,
        precioCompra: args.producto.precioCompra,
        iva: args.producto.iva,
        margen: args.producto.margen,
        promociones: args.producto.promociones,
        ean: args.producto.ean,
        cantidad: args.producto.cantidad,
        cantidadRestock: args.producto.cantidadRestock,
        alta: args.producto.alta,
    });
    const resultado = yield updatedProduct.save();
    if (resultado.id) {
        return { message: "Producto añadido correctamente", successful: true, };
    }
    return { message: "No se ha podido añadir el producto", successful: false };
});
exports.addProductoResolver = addProductoResolver;
const deleteProductoResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de producto inválido", successful: false };
    }
    const deletedProd = yield db.ProductDBController.CollectionModel.deleteOne({ _id: args._id });
    if (deletedProd.deletedCount > 0) {
        return { message: "Producto eliminado correctamente", successful: true };
    }
    return { message: "No se ha podido eliminar el producto", successful: false };
});
exports.deleteProductoResolver = deleteProductoResolver;
const updateProductoResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args.producto._id);
    if (!isQueryValidId) {
        return { message: "ID de producto inválido", successful: false };
    }
    const db = database_1.Database.Instance();
    const updatedProduct = {
        nombre: args.producto.nombre,
        proveedor: args.producto.proveedor,
        familia: args.producto.familia,
        precioVenta: args.producto.precioVenta,
        precioCompra: args.producto.precioCompra,
        iva: args.producto.iva,
        margen: args.producto.margen,
        promociones: args.producto.promociones,
        ean: args.producto.ean,
        cantidad: args.producto.cantidad,
        cantidadRestock: args.producto.cantidadRestock,
        alta: args.producto.alta,
    };
    const resultadoUpdate = yield db.ProductDBController.CollectionModel.updateOne({ _id: args.producto._id }, { $set: updatedProduct });
    if (resultadoUpdate.modifiedCount > 0) {
        return { message: "Producto actualizado correctamente", successful: true };
    }
    return { message: "No se ha podido actualizar el producto", successful: false };
});
exports.updateProductoResolver = updateProductoResolver;
