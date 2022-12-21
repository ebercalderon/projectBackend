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
exports.updateProveedorResolver = exports.deleteProveedorResolver = exports.addProveedorResolver = exports.proveedoresResolver = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../../../databases/database");
const proveedoresResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const db = database_1.Database.Instance();
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const prooveedores = yield db.ProveedorDBController.CollectionModel.find()
            .limit(args.limit || 150)
            .exec();
        return prooveedores;
    }
    if ((_a = args.find) === null || _a === void 0 ? void 0 : _a.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(query);
        let prooveedores = {};
        if (isQueryValidId) {
            prooveedores = yield db.ProveedorDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();
        }
        else {
            prooveedores = yield db.ProveedorDBController.CollectionModel.find({
                $or: [
                    { nombre: { "$regex": query, "$options": "i" } },
                    { email: { "$regex": query, "$options": "i" } },
                    { contacto: { "$regex": query, "$options": "i" } },
                    { localidad: { "$regex": query, "$options": "i" } },
                    { pais: { "$regex": query, "$options": "i" } },
                    { provincia: { "$regex": query, "$options": "i" } },
                    { cp: { "$regex": query, "$options": "i" } },
                    { direccion: { "$regex": query, "$options": "i" } },
                ]
            })
                .limit(args.limit || 150)
                .exec();
        }
        return prooveedores;
    }
    return [];
});
exports.proveedoresResolver = proveedoresResolver;
const addProveedorResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const db = database_1.Database.Instance();
    const prov = yield db.ProveedorDBController.CollectionModel.exists({ nombre: args.fields.nombre });
    if (prov) {
        return { message: "Nombre del proveedor en uso", successful: false, data: null };
    }
    const cif = yield db.ProveedorDBController.CollectionModel.exists({ nombre: args.fields.cif });
    if (cif) {
        return { message: "El CIF del proveedor está en uso", successful: false, data: null };
    }
    const proveedorContacto = {
        nombre: ((_b = args.fields.contacto) === null || _b === void 0 ? void 0 : _b.nombre) || "",
        telefono: ((_c = args.fields.contacto) === null || _c === void 0 ? void 0 : _c.telefono) || "",
        email: ((_d = args.fields.contacto) === null || _d === void 0 ? void 0 : _d.email) || ""
    };
    const updatedProv = new db.ProveedorDBController.CollectionModel({
        nombre: args.fields.nombre,
        cif: args.fields.cif,
        direccion: args.fields.direccion,
        contacto: proveedorContacto,
        telefono: args.fields.telefono,
        localidad: args.fields.localidad,
        provincia: args.fields.provincia,
        cp: args.fields.cp,
        pais: args.fields.pais,
        email: args.fields.email,
        nombreContacto: args.fields.contacto,
    });
    const resultado = yield updatedProv.save();
    if (resultado.id) {
        return { message: "Proveedor añadido correctamente", successful: true, data: resultado };
    }
    return { message: "No se ha podido añadir el proveedor", successful: false, data: null };
});
exports.addProveedorResolver = addProveedorResolver;
const deleteProveedorResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de proveedor inválido", successful: false };
    }
    const deletedProd = yield db.ProveedorDBController.CollectionModel.deleteOne({ _id: args._id });
    if (deletedProd.deletedCount > 0) {
        return { message: "Proveedor eliminado correctamente", successful: true };
    }
    return { message: "No se ha podido eliminar el proveedor", successful: false };
});
exports.deleteProveedorResolver = deleteProveedorResolver;
const updateProveedorResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de proveedor inválido", successful: false };
    }
    const db = database_1.Database.Instance();
    const updatedProv = {
        nombre: args.proveedor.nombre,
        cif: args.proveedor.cif,
        direccion: args.proveedor.direccion,
        contacto: args.proveedor.contacto,
        telefono: args.proveedor.telefono,
        localidad: args.proveedor.localidad,
        provincia: args.proveedor.provincia,
        cp: args.proveedor.cp,
        pais: args.proveedor.pais,
        email: args.proveedor.email,
    };
    const resultadoUpdate = yield db.ProveedorDBController.CollectionModel.updateOne({ _id: args._id }, { $set: updatedProv });
    if (resultadoUpdate.modifiedCount > 0) {
        return { message: "Proveedor actualizado correctamente", successful: true };
    }
    return { message: "No se ha podido actualizar el proveedor", successful: false };
});
exports.updateProveedorResolver = updateProveedorResolver;
