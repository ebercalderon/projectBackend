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
exports.updateCierreTpvResolver = exports.deleteCierreTpvResolver = exports.addCierreTpvResolver = exports.cierreTpvsResolver = exports.cierreTpvResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const database_1 = require("../../../databases/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const cierreTpvResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (!args.find.nombre && !args.find._id)
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Find no puede estar vacío');
    const db = database_1.Database.Instance();
    if (args.find.nombre) {
        return yield db.TPVDBController.CollectionModel.findOne({ nombre: args.find.nombre }).exec();
    }
    return yield db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
});
exports.cierreTpvResolver = cierreTpvResolver;
const cierreTpvsResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
            const cierres = yield db.CierreTPVDBController.CollectionModel.find({})
                .sort({ apertura: -1 })
                .limit(args.limit || 200)
                .exec();
            return cierres;
        }
        if (args.find.apertura) {
            const apertura = new Date(args.find.apertura);
            const cierres = yield db.CierreTPVDBController.CollectionModel.find({ apertura: apertura })
                .sort({ apertura: -1 })
                .limit(args.limit || 200)
                .exec();
            return cierres;
        }
        if (args.find.query) {
            const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args.find.query);
            let tpv;
            if (isQueryValidId) {
                const cierre = yield db.CierreTPVDBController.CollectionModel.findById(args.find.query);
                if (cierre !== null) {
                    return [cierre];
                }
                tpv = yield db.TPVDBController.CollectionModel.findById(args.find.query);
            }
            if (args.find.fechaInicial && args.find.fechaFinal) {
                const fechaInicial = new Date(args.find.fechaInicial);
                const fechaFinal = new Date(args.find.fechaFinal);
                let filtro;
                if (tpv) {
                    filtro = {
                        tpv: tpv._id,
                        cierre: {
                            $gte: fechaInicial,
                            $lt: fechaFinal
                        }
                    };
                }
                else {
                    filtro = {
                        $or: [
                            { "abiertoPor.nombre": args.find.query },
                            { "abiertoPor.email": args.find.query },
                            { "cerradoPor.nombre": args.find.query },
                            { "cerradoPor.email": args.find.query }
                        ],
                        cierre: {
                            $gte: fechaInicial,
                            $lt: fechaFinal
                        }
                    };
                }
                const cierres = yield db.CierreTPVDBController.CollectionModel.find(filtro)
                    .sort({ apertura: -1 })
                    .limit(args.limit || 200)
                    .exec();
                return cierres;
            }
            else {
                let filtro;
                if (tpv) {
                    filtro = {
                        tpv: tpv._id
                    };
                }
                else {
                    filtro = {
                        $or: [
                            { "abiertoPor.nombre": args.find.query },
                            { "abiertoPor.email": args.find.query },
                            { "cerradoPor.nombre": args.find.query },
                            { "cerradoPor.email": args.find.query }
                        ]
                    };
                }
                const cierres = yield db.CierreTPVDBController.CollectionModel.find(filtro)
                    .sort({ apertura: -1 })
                    .limit(args.limit || 200)
                    .exec();
                return cierres;
            }
        }
        if (args.find.fechaInicial && args.find.fechaFinal) {
            const fechaInicial = new Date(args.find.fechaInicial);
            const fechaFinal = new Date(args.find.fechaFinal);
            const cierres = yield db.CierreTPVDBController.CollectionModel.find({
                cierre: {
                    $gte: fechaInicial,
                    $lt: fechaFinal
                }
            })
                .sort({ apertura: -1 })
                .limit(args.limit || 200)
                .exec();
            return cierres;
        }
        return [];
    }
    catch (err) {
        return [];
    }
});
exports.cierreTpvsResolver = cierreTpvsResolver;
const addCierreTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return {
                message: "Error en servidor: clave privada JWT no encontrada",
                successful: false,
                token: ""
            };
        }
        const db = database_1.Database.Instance();
        const payload = { _id: args.cierre.abiertoPor._id, nombre: args.cierre.abiertoPor.nombre, apellidos: args.cierre.abiertoPor.apellidos, email: args.cierre.abiertoPor.email, rol: args.cierre.abiertoPor.rol };
        const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
        const token = jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: 3600 * Number(jwtHoursDuration)
        });
        const tpv = yield db.TPVDBController.CollectionModel.findOne({ _id: args.cierre.tpv, libre: false }).exec();
        if (!tpv) {
            return {
                message: "Este empleado no está usando esta TPV en este momento",
                successful: false,
                token: `Bearer ${token}`
            };
        }
        const fechaApertura = new Date().setTime(Number(args.cierre.apertura));
        const fechaActual = Date.now();
        const ventas = yield db.VentasDBController.CollectionModel.find({ "createdAt": { $gte: fechaApertura, $lt: fechaActual } }).exec();
        const productosVendidos = ventas.map(v => v.productos).flat();
        let beneficio = productosVendidos.reduce((total, p) => {
            return total += (p.precioCompra - p.precioFinal) * p.cantidadVendida;
        }, 0);
        const res = yield db.CierreTPVDBController.CollectionModel.create({
            tpv: args.cierre.tpv,
            abiertoPor: args.cierre.abiertoPor,
            cerradoPor: args.cierre.cerradoPor,
            apertura: fechaApertura,
            cierre: fechaActual,
            cajaInicial: args.cierre.cajaInicial,
            numVentas: args.cierre.numVentas,
            dineroEsperadoEnCaja: args.cierre.dineroEsperadoEnCaja,
            dineroRealEnCaja: args.cierre.dineroRealEnCaja,
            ventasEfectivo: args.cierre.ventasEfectivo,
            ventasTarjeta: args.cierre.ventasTarjeta,
            ventasTotales: args.cierre.ventasTotales,
            dineroRetirado: args.cierre.dineroRetirado,
            fondoDeCaja: args.cierre.fondoDeCaja,
            beneficio: beneficio,
            nota: args.cierre.nota || ""
        });
        if (res.errors) {
            return {
                message: "No se ha podido añadir el cierre de caja",
                successful: false,
                token: token,
                cierre: null
            };
        }
        const tpvUpdated = yield db.TPVDBController.CollectionModel.updateOne({ _id: tpv._id }, { libre: true });
        if (tpvUpdated.modifiedCount <= 0) {
            return {
                message: "No se ha podido liberar la TPV",
                successful: false,
                token: `Bearer ${token}`,
                cierre: res
            };
        }
        return {
            message: "Cierre añadido correctamente",
            successful: true,
            token: `Bearer ${token}`,
            cierre: res
        };
    }
    catch (err) {
        return {
            message: err,
            successful: false,
            token: "",
            cierre: null
        };
    }
});
exports.addCierreTpvResolver = addCierreTpvResolver;
const deleteCierreTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const isQueryValidId = mongoose_1.default.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de cierre inválido", successful: false };
    }
    const deletedProd = yield db.CierreTPVDBController.CollectionModel.deleteOne({ _id: args._id });
    if (deletedProd.deletedCount > 0) {
        return { message: "Cierre eliminado correctamente", successful: true };
    }
    return { message: "No se ha podido eliminar el cierre", successful: false };
});
exports.deleteCierreTpvResolver = deleteCierreTpvResolver;
const updateCierreTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
});
exports.updateCierreTpvResolver = updateCierreTpvResolver;
