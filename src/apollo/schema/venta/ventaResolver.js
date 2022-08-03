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
exports.updateVentaResolver = exports.deleteVentaResolver = exports.addVentaResolver = exports.ventasResolver = exports.ventaResolver = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apollo_server_express_1 = require("apollo-server-express");
const database_1 = require("../../../databases/database");
const ventaResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (args === null || !args || Object.keys(args).length === 0 && args.constructor === Object)
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Find no puede estar vacío');
    const db = database_1.Database.Instance();
    if (args._id) {
        const venta = yield db.VentasDBController.CollectionModel.findOne({ _id: args._id }).exec();
        if (venta)
            return venta;
    }
    return null;
});
exports.ventaResolver = ventaResolver;
const ventasResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const db = database_1.Database.Instance();
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const ventas = yield db.VentasDBController.CollectionModel.find({}).sort({ createdAt: "desc" }).limit(args.limit || 500).skip(args.offset || 0).exec();
        if (ventas)
            return ventas;
    }
    if (((_a = args.find) === null || _a === void 0 ? void 0 : _a.createdAt) && args.find.tpv) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ tpv: args.find.tpv, "createdAt": { $gte: parseInt(args.find.createdAt), $lt: Date.now() } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_b = args.find) === null || _b === void 0 ? void 0 : _b._ids) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ _id: args.find._ids })
            .sort({ createdAt: order || "desc" })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_c = args.find) === null || _c === void 0 ? void 0 : _c.clienteId) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ $cliente: { _id: args.find.clienteId } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_d = args.find) === null || _d === void 0 ? void 0 : _d.tipo) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ tipo: args.find.tipo })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_e = args.find) === null || _e === void 0 ? void 0 : _e.vendedorId) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ $vendidoPor: { _id: args.find.vendedorId } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_f = args.find) === null || _f === void 0 ? void 0 : _f.createdAt) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ createdAt: args.find.createdAt })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_g = args.find) === null || _g === void 0 ? void 0 : _g.tpv) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({ tpv: args.find.tpv })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if (((_h = args.find) === null || _h === void 0 ? void 0 : _h.fechaInicial) && ((_j = args.find) === null || _j === void 0 ? void 0 : _j.fechaFinal) && !args.find.query) {
        let order = "desc";
        if (args.order) {
            order = args.order;
        }
        const ventas = yield db.VentasDBController.CollectionModel.find({
            "createdAt": {
                $gte: new Date(Number(args.find.fechaInicial)),
                $lt: new Date(Number(args.find.fechaFinal))
            }
        })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();
        if (ventas)
            return ventas;
    }
    if ((_k = args.find) === null || _k === void 0 ? void 0 : _k.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(query);
        let ventas = [];
        if (isQueryValidId) {
            ventas = yield db.VentasDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();
            return ventas;
        }
        let queryConFecha = [{}];
        let limite = args.limit || 150;
        if (args.find.fechaInicial && args.find.fechaFinal) {
            queryConFecha = [{
                    "createdAt": {
                        $gte: new Date(Number(args.find.fechaInicial)),
                        $lt: new Date(Number(args.find.fechaFinal))
                    }
                }];
            limite = 1000;
        }
        const tpv = yield db.TPVDBController.CollectionModel.findOne({ nombre: { "$regex": query, "$options": "i" } });
        if (tpv) {
            const r = yield db.VentasDBController.CollectionModel.find({
                tpv: tpv._id,
                "createdAt": {
                    $gte: new Date(Number(args.find.fechaInicial)),
                    $lt: new Date(Number(args.find.fechaFinal))
                }
            })
                .limit(args.limit || 150)
                .exec();
            return [...r];
        }
        ventas = yield db.VentasDBController.CollectionModel.find({
            $or: [
                { "productos.nombre": { "$regex": query, "$options": "i" } },
                { "productos.ean": { "$regex": query, "$options": "i" } },
                { "productos.proveedor": { "$regex": query, "$options": "i" } },
                { "productos.familia": { "$regex": query, "$options": "i" } },
                { "vendidoPor.nombre": { "$regex": query, "$options": "i" } },
                { "vendidoPor.email": { "$regex": query, "$options": "i" } },
                { "vendidoPor.dni": { "$regex": query, "$options": "i" } },
                { "vendidoPor.rol": { "$regex": query, "$options": "i" } },
                { "modificadoPor.nombre": { "$regex": query, "$options": "i" } },
                { "modificadoPor.email": { "$regex": query, "$options": "i" } },
                { "modificadoPor.dni": { "$regex": query, "$options": "i" } },
                { "modificadoPor.rol": { "$regex": query, "$options": "i" } },
                { "tipo": { "$regex": query, "$options": "i" } },
                { "cliente.nombre": { "$regex": query, "$options": "i" } },
                { "cliente.nif": { "$regex": query, "$options": "i" } }
            ],
            $and: queryConFecha,
        })
            .limit(limite)
            .sort({ "createdAt": -1 })
            .exec();
        return ventas;
    }
    return [];
});
exports.ventasResolver = ventasResolver;
const addVentaResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const saleToAdd = new db.VentasDBController.CollectionModel({
            productos: args.fields.productos,
            dineroEntregadoEfectivo: args.fields.dineroEntregadoEfectivo,
            dineroEntregadoTarjeta: args.fields.dineroEntregadoTarjeta,
            precioVentaTotalSinDto: args.fields.precioVentaTotalSinDto,
            precioVentaTotal: args.fields.precioVentaTotal,
            cambio: args.fields.cambio,
            cliente: args.fields.cliente,
            vendidoPor: args.fields.vendidoPor,
            modificadoPor: args.fields.modificadoPor,
            tipo: args.fields.tipo,
            descuentoEfectivo: args.fields.descuentoEfectivo,
            descuentoPorcentaje: args.fields.descuentoPorcentaje,
            tpv: args.fields.tpv
        });
        const res = yield saleToAdd.save();
        let isUpdatingCorrectly = true;
        args.fields.productos.forEach((p) => __awaiter(void 0, void 0, void 0, function* () {
            const err = yield db.ProductDBController.CollectionModel.findOneAndUpdate({ _id: p._id }, { "$inc": { "cantidad": -p.cantidadVendida } });
            if ((err === null || err === void 0 ? void 0 : err.errors) && isUpdatingCorrectly) {
                isUpdatingCorrectly = false;
            }
        }));
        if (res.errors) {
            return { message: "No se ha podido añadir la venta a la base de datos", successful: false };
        }
        if (!isUpdatingCorrectly) {
            return { message: "Venta añadida pero las cantidades no han sido actualizadas correctamente", successful: true };
        }
        return { message: "Venta añadida con éxito", successful: true, _id: res._id, createdAt: res.createdAt };
    }
    catch (err) {
        return { message: err, successful: false };
    }
});
exports.addVentaResolver = addVentaResolver;
const deleteVentaResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
});
exports.deleteVentaResolver = deleteVentaResolver;
const updateVentaResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de venta inválido", successful: false };
    }
    const db = database_1.Database.Instance();
    const ventaOriginal = yield db.VentasDBController.CollectionModel.findOne({ _id: args._id });
    if (!ventaOriginal) {
        return { message: "La venta original no existe", successful: false };
    }
    const venta = {
        productos: ventaOriginal.productos,
        dineroEntregadoEfectivo: ventaOriginal.dineroEntregadoEfectivo,
        dineroEntregadoTarjeta: ventaOriginal.dineroEntregadoTarjeta,
        precioVentaTotalSinDto: ventaOriginal.precioVentaTotalSinDto,
        precioVentaTotal: args.precioVentaTotal,
        cambio: ventaOriginal.cambio,
        cliente: args.cliente,
        vendidoPor: ventaOriginal.vendidoPor,
        modificadoPor: args.modificadoPor,
        tipo: args.tipo,
        descuentoEfectivo: ventaOriginal.descuentoEfectivo,
        descuentoPorcentaje: ventaOriginal.descuentoPorcentaje,
        tpv: ventaOriginal.tpv,
    };
    const resultadoUpdate = yield db.VentasDBController.CollectionModel.updateOne({ _id: args._id }, { $set: venta });
    const updatedSale = yield db.VentasDBController.CollectionModel.findOne({ _id: args._id });
    if (resultadoUpdate.modifiedCount > 0) {
        return { _id: args._id, message: "Venta actualizada correctamente", successful: true, createdAt: updatedSale === null || updatedSale === void 0 ? void 0 : updatedSale.createdAt };
    }
    return { message: "No se ha podido actualizar la venta", successful: false };
});
exports.updateVentaResolver = updateVentaResolver;
