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
exports.freeTpvResolver = exports.ocupyTpvResolver = exports.transferirTpvResolver = exports.updateTpvResolver = exports.deleteTpvResolver = exports.addTpvResolver = exports.tpvsResolver = exports.tpvResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const database_1 = require("../../../databases/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tpvResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if ((!args.find.nombre && !args.find._id))
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Find no puede estar vacío');
    const db = database_1.Database.Instance();
    if (!args.find.empleadoId) {
        if (args.find._id) {
            return yield db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
        }
        return yield db.TPVDBController.CollectionModel.findOne({ nombre: args.find.nombre }).exec();
    }
    const empleado = yield db.EmployeeDBController.CollectionModel.findOne({ _id: args.find.empleadoId });
    if (args.find.nombre) {
        const tpv = yield db.TPVDBController.CollectionModel.findOne({ nombre: args.find.nombre }).exec();
        if (tpv) {
            if (empleado) {
                const empleadoClean = {
                    _id: empleado._id,
                    nombre: empleado.nombre,
                    apellidos: empleado.apellidos,
                    rol: empleado.rol,
                    email: empleado.email,
                    dni: empleado.dni,
                };
                tpv.enUsoPor = empleadoClean;
            }
            return tpv;
        }
        return undefined;
    }
    if (args.find._id) {
        const tpv = yield db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
        if (tpv) {
            if (empleado) {
                const empleadoClean = {
                    _id: empleado._id,
                    nombre: empleado.nombre,
                    apellidos: empleado.apellidos,
                    rol: empleado.rol,
                    email: empleado.email,
                    dni: empleado.dni,
                };
                tpv.enUsoPor = empleadoClean;
            }
            return tpv;
        }
        return undefined;
    }
    return yield db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
});
exports.tpvResolver = tpvResolver;
const tpvsResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const tpv = yield db.TPVDBController.CollectionModel.find({})
            .limit(150)
            .exec();
        return tpv;
    }
    if (args.find) {
        const tpv = yield db.TPVDBController.CollectionModel.find({ libre: args.find.libre })
            .limit(150)
            .exec();
        return tpv;
    }
    return [];
});
exports.tpvsResolver = tpvsResolver;
const addTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
});
exports.addTpvResolver = addTpvResolver;
const deleteTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
});
exports.deleteTpvResolver = deleteTpvResolver;
const updateTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
});
exports.updateTpvResolver = updateTpvResolver;
const transferirTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw "No se ha encontrado la clave privada del JWT";
    }
    const tpv = yield db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV });
    if (!tpv) {
        return { message: "TPV no encontrada", token: null, successful: false };
    }
    if (tpv.libre)
        return { message: "No se puede transferir una TPV que no está en uso", token: null, successful: false };
    const empleadoRemitente = yield db.EmployeeDBController.CollectionModel.findOne({ _id: tpv.enUsoPor._id });
    if (!empleadoRemitente) {
        return { message: "Empleado remitente no encontrado", token: null, successful: false };
    }
    const empleadoDestinatario = yield db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleadoDestinatario });
    if (!empleadoDestinatario) {
        return { message: "Empleado destinatario no encontrado", token: null, successful: false };
    }
    const tpvs = yield db.TPVDBController.CollectionModel.find({ libre: false });
    for (let index = 0; index < tpvs.length; index++) {
        const tpv = tpvs[index];
        if (tpv.enUsoPor._id === args.idEmpleadoDestinatario) {
            return { message: "El empleado destinatario está usando otra TPV", successful: false, token: null };
        }
    }
    const empleado = {
        _id: empleadoDestinatario._id,
        nombre: empleadoDestinatario.nombre,
        apellidos: empleadoDestinatario.apellidos,
        rol: empleadoDestinatario.rol,
        email: empleadoDestinatario.email,
        dni: empleadoDestinatario.dni,
    };
    const res = yield db.TPVDBController.CollectionModel.updateOne({ _id: args.idTPV }, { enUsoPor: empleado });
    if (res.modifiedCount <= 0) {
        return { message: "No se ha podido transferir la TPV", successful: false, token: null };
    }
    const payload = { _id: empleadoRemitente._id, nombre: empleadoRemitente.nombre, apellidos: empleadoRemitente.apellidos, email: empleadoRemitente.email, rol: empleadoRemitente.rol };
    const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: 3600 * Number(jwtHoursDuration)
    });
    return { message: "TPV transferida correctamente", successful: true, token: `Bearer ${token}` };
});
exports.transferirTpvResolver = transferirTpvResolver;
const ocupyTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw "No se ha encontrado la clave privada del JWT";
    }
    const empleado = yield db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleado });
    if (!empleado) {
        return { token: null, successful: false };
    }
    const tpvEnUsoPorEmpleado = yield db.TPVDBController.CollectionModel.findOne({ libre: false, "enUsoPor._id": args.idEmpleado });
    if (!tpvEnUsoPorEmpleado) {
        return { token: null, successful: false };
    }
    const tpv = yield db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV });
    if (!tpv) {
        return { token: null, successful: false };
    }
    if (!tpv.libre)
        return { token: null, successful: false };
    const empleadoClean = {
        _id: empleado._id,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        rol: empleado.rol,
        email: empleado.email,
        dni: empleado.dni,
    };
    const tpvUpdate = {
        libre: false,
        abiertoPor: empleadoClean,
        enUsoPor: empleadoClean,
        cajaInicial: args.cajaInicial,
        fechaApertura: String(Date.now()),
    };
    yield tpv.updateOne(tpvUpdate);
    const payload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol, TPV: tpv._id };
    const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: 3600 * Number(jwtHoursDuration)
    });
    return {
        token: `Bearer ${token}`,
        successful: true
    };
});
exports.ocupyTpvResolver = ocupyTpvResolver;
const freeTpvResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.Instance();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw "No se ha encontrado la clave privada del JWT";
    }
    const empleado = yield db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleado }).exec();
    if (!empleado) {
        throw new apollo_server_express_1.UserInputError('Empleado no encontrado');
    }
    const tpv = yield db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV }).exec();
    if (!tpv)
        throw new apollo_server_express_1.UserInputError('TPV no encontrada');
    if (tpv.libre)
        throw new apollo_server_express_1.UserInputError('TPV actualmente ocupada por otro empleado');
    const empleadoClean = {
        _id: empleado._id,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        rol: empleado.rol,
        email: empleado.email,
        dni: empleado.dni
    };
    yield tpv.updateOne({ libre: true, enUsoPor: empleadoClean });
    const payload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol };
    const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: 3600 * Number(jwtHoursDuration)
    });
    return {
        token: `Bearer ${token} `,
        successful: true
    };
});
exports.freeTpvResolver = freeTpvResolver;
