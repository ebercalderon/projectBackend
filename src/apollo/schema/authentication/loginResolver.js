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
exports.loginResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const database_1 = require("../../../databases/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (args === null || !args || Object.keys(args).length === 0 && args.constructor === Object)
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Find no puede estar vacío');
    if (!args.loginValues.email || !args.loginValues.password) {
        throw new apollo_server_express_1.UserInputError('Usuario y/o contraseña no pueden estar vacíos');
    }
    try {
        const db = database_1.Database.Instance();
        const empleado = yield db.EmployeeDBController.CollectionModel.findOne({ email: args.loginValues.email }).exec();
        if (!empleado) {
            return { message: "Usuario y/o contraseña incorrectas", success: false, token: null };
        }
        const passwordsMatch = yield bcryptjs_1.default.compare(args.loginValues.password, empleado === null || empleado === void 0 ? void 0 : empleado.hashPassword);
        if (!passwordsMatch) {
            return { message: "Usuario y/o contraseña incorrectas", success: false, token: null };
        }
        const secret = process.env.JWT_SECRET;
        if (secret) {
            const tpv = yield db.TPVDBController.CollectionModel.findOne({ "enUsoPor._id": empleado._id, libre: false }).exec();
            let payload;
            if (tpv) {
                payload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol, TPV: tpv._id };
            }
            else {
                payload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol };
            }
            const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
            const token = jsonwebtoken_1.default.sign(payload, secret, {
                expiresIn: 3600 * Number(jwtHoursDuration)
            });
            return {
                message: "Autenticación realizada con éxito",
                successful: true,
                token: `Bearer ${token}`
            };
        }
        return { message: "Usuario y/o contraseña incorrectas", successful: false, token: null };
    }
    catch (err) {
        return { message: "Usuario y/o contraseña incorrectas", successful: false, token: null };
    }
});
exports.loginResolver = loginResolver;
