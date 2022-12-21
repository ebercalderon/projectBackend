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
exports.updateMermaResolver = exports.deleteMermaResolver = exports.addMermaResolver = exports.mermasResolver = exports.mermaResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../../../databases/database");
const mermaResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (!args.find._id)
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Find no puede estar vacío');
    const db = database_1.Database.Instance();
    if (args.find._id) {
        const merma = yield db.MermaDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
        if (merma)
            return merma;
    }
    return null;
});
exports.mermaResolver = mermaResolver;
const mermasResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const db = database_1.Database.Instance();
    let order = "desc";
    if ((_a = args.find) === null || _a === void 0 ? void 0 : _a.query) {
        const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args.find.query);
        if (isQueryValidId) {
            const mermas = yield db.MermaDBController.CollectionModel.find({ _id: args.find.query })
                .limit(args.limit || 150)
                .exec();
            return mermas;
        }
        const mermas = yield db.MermaDBController.CollectionModel.find({
            $or: [
                { "productos.nombre": { "$regex": args.find.query, "$options": "i" } },
                { "productos.ean": args.find.query },
                { "productos.proveedor": { "$regex": args.find.query, "$options": "i" } },
                { "productos.familia": { "$regex": args.find.query, "$options": "i" } },
                { "productos.motivo": { "$regex": args.find.query, "$options": "i" } },
                { "creadoPor.nombre": args.find.query },
                { "creadoPor.email": args.find.query },
                { "creadoPor.dni": args.find.query },
            ],
            $and: args.find.fechaInicial && args.find.fechaFinal ?
                [
                    {
                        "createdAt": {
                            $gte: new Date(Number(args.find.fechaInicial)),
                            $lt: new Date(Number(args.find.fechaFinal))
                        }
                    }
                ]
                :
                    [{}]
        })
            .sort(order)
            .limit(args.limit || 150)
            .exec();
        return mermas;
    }
    if (((_b = args.find) === null || _b === void 0 ? void 0 : _b.fechaFinal) && ((_c = args.find) === null || _c === void 0 ? void 0 : _c.fechaFinal)) {
        const mermas = yield db.MermaDBController.CollectionModel.find({
            "createdAt": {
                $gte: new Date(Number(args.find.fechaInicial)),
                $lt: new Date(Number(args.find.fechaFinal))
            }
        })
            .sort({ createdAt: order })
            .limit(args.limit || 1000)
            .exec();
        if (mermas)
            return mermas;
    }
    return yield db.MermaDBController.CollectionModel.find()
        .sort({ createdAt: order })
        .limit(args.limit || 150)
        .exec();
});
exports.mermasResolver = mermasResolver;
const addMermaResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const empleado = yield db.EmployeeDBController.CollectionModel.findOne({ _id: args.merma.empleadoId });
        if (!empleado) {
            return { message: "El empleado no existe en el sistema", successful: false };
        }
        const costes = yield CalcularMermaValues(args.merma.productos);
        const productosMermados = yield GetProductosMermados(args.merma.productos);
        const merma = {
            productos: productosMermados,
            creadoPor: empleado,
            costeProductos: Number(costes.costeProductos.toFixed(2)),
            ventasPerdidas: Number(costes.ventas.toFixed(2)),
            beneficioPerdido: Number(costes.beneficio.toFixed(2))
        };
        const newMerma = new db.MermaDBController.CollectionModel(merma);
        const mermaGuardada = yield newMerma.save();
        if (mermaGuardada !== newMerma) {
            return { message: "No se ha podido añadir la merma", successful: false };
        }
        const cantidadActualizada = yield ActualizarCantidadProductos(merma);
        if (!cantidadActualizada) {
            return { message: "Merma creada pero no se ha podido actualizar las cantidades", successful: true };
        }
        return { message: "Merma añadida correctamente", successful: true, };
    }
    catch (err) {
        return { message: err, successful: false };
    }
});
exports.addMermaResolver = addMermaResolver;
const deleteMermaResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
        if (!isQueryValidId) {
            return { message: "ID de merma inválido", successful: false };
        }
        return yield DeleteMerma(args._id);
    }
    catch (err) {
        return { message: err, successful: false };
    }
});
exports.deleteMermaResolver = deleteMermaResolver;
const updateMermaResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
        if (!isQueryValidId) {
            return { message: "ID de merma inválido", successful: false };
        }
        const empleado = yield db.EmployeeDBController.CollectionModel.findOne({ _id: args.merma.empleadoId });
        if (empleado === null) {
            return { message: "El empleado no existe en el sistema", successful: false };
        }
        const mermaVieja = yield db.MermaDBController.CollectionModel.findOne({ _id: args._id });
        if (mermaVieja === null) {
            return { message: "No se puede actualizar una merma que no existe", successful: false };
        }
        CheckMermaConsistency(args.merma);
        const { successful } = yield DeleteMerma(args._id);
        if (!successful) {
            return { message: "No se ha podido actualizar la merma correctamente", successful: false };
        }
        const costes = yield CalcularMermaValues(args.merma.productos);
        const productosMermados = yield GetProductosMermados(args.merma.productos);
        const updatedMerma = {
            _id: args._id,
            productos: productosMermados,
            creadoPor: empleado,
            costeProductos: Number(costes.costeProductos.toFixed(2)),
            ventasPerdidas: Number(costes.ventas.toFixed(2)),
            beneficioPerdido: Number(costes.beneficio.toFixed(2))
        };
        const newMerma = new db.MermaDBController.CollectionModel(updatedMerma);
        const mermaGuardada = yield newMerma.save();
        if (mermaGuardada !== newMerma) {
            return { message: "No se ha podido actualizar la merma", successful: false };
        }
        const cantidadActualizada = yield ActualizarCantidadProductos(updatedMerma);
        if (!cantidadActualizada) {
            return { message: "Merma creada pero no se ha podido actualizar las cantidades", successful: true };
        }
        return { message: "Merma actualizada correctamente", successful: true };
    }
    catch (err) {
        return { message: err, successful: false };
    }
});
exports.updateMermaResolver = updateMermaResolver;
const CalcularMermaValues = (productosMermados) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const prodMap = new Map();
    const cursor = db.ProductDBController.CollectionModel.find({}).cursor();
    yield cursor.eachAsync((prod) => {
        prodMap.set(prod._id.valueOf(), prod);
    });
    let costes = { costeProductos: 0, ventas: 0, beneficio: 0 };
    for (let index = 0; index < productosMermados.length; index++) {
        const prodMermado = productosMermados[index];
        if (prodMermado.cantidad <= 0) {
            throw "Una merma no puede tener una cantidad igual o inferior a cero";
        }
        const producto = prodMap.get(prodMermado._id);
        if (producto === null || producto === undefined) {
            throw "El producto añadido a la merma no existe en el sistema";
        }
        const precioCompraIva = producto.precioCompra + (producto.precioCompra * (producto.iva / 100));
        costes.costeProductos += producto.precioCompra * prodMermado.cantidad;
        costes.ventas += producto.precioVenta * prodMermado.cantidad;
        costes.beneficio += (producto.precioVenta - precioCompraIva) * prodMermado.cantidad;
    }
    return costes;
});
const GetProductosMermados = (productosMermados) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const prodMap = new Map();
    const cursor = db.ProductDBController.CollectionModel.find({}).cursor();
    yield cursor.eachAsync((prod) => {
        prodMap.set(prod._id.valueOf(), prod);
    });
    let resultado = [];
    for (let index = 0; index < productosMermados.length; index++) {
        const productoMermado = productosMermados[index];
        const prod = prodMap.get(productoMermado._id);
        if (prod === null || prod === undefined) {
            throw "El producto añadido a la merma no existe en el sistema";
        }
        const pRes = {
            _id: prod._id,
            nombre: prod.nombre,
            proveedor: prod.proveedor,
            cantidad: productoMermado.cantidad,
            familia: prod.familia,
            margen: prod.margen,
            ean: prod.ean,
            iva: prod.iva,
            precioCompra: prod.precioCompra,
            precioVenta: prod.precioVenta,
            motivo: productoMermado.motivo,
        };
        resultado.push(pRes);
    }
    return resultado;
});
const DeleteMerma = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const merma = yield db.MermaDBController.CollectionModel.findOne({ _id: _id });
        if (!merma) {
            return { message: "No se ha encontrado la merma que se quiere eliminar o modificar", successful: false };
        }
        const actualizadoCorrectamente = yield ActualizarCantidadProductos(merma, true);
        if (!actualizadoCorrectamente) {
            return { message: "No se ha podido actualizar las cantidades", successful: false };
        }
        const deletedMerm = yield db.MermaDBController.CollectionModel.deleteOne({ _id: _id });
        if (deletedMerm.deletedCount <= 0) {
            return { message: "No se ha podido eliminar la merma", successful: false };
        }
        return { message: "Merma eliminada correctamente", successful: true };
    }
    catch (err) {
        return { message: "Error al eliminar la merma: " + err, successful: false };
    }
});
const ActualizarCantidadProductos = (merma, isDeleting) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        for (let index = 0; index < merma.productos.length; index++) {
            const productoMermado = merma.productos[index];
            const res = yield db.ProductDBController.CollectionModel
                .updateOne({ _id: productoMermado._id }, { "$inc": { "cantidad": isDeleting ? productoMermado.cantidad : -productoMermado.cantidad } }, { timestamps: false });
            if (res.modifiedCount <= 0) {
                return false;
            }
        }
        return true;
    }
    catch (err) {
        return false;
    }
});
const CheckMermaConsistency = (merma) => {
    for (let index = 0; index < merma.productos.length; index++) {
        const prod = merma.productos[index];
        if (prod.cantidad <= 0) {
            throw "Una merma no puede tener una cantidad igual o inferior a cero";
        }
    }
};
