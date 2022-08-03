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
exports.jwtValidatorResolver = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../../databases/database");
const jwtValidatorResolver = (parent, args, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    if (args === null || !args || Object.keys(args).length === 0 && args.constructor === Object)
        throw new apollo_server_express_1.UserInputError('Argumentos inválidos: Jwt no puede estar vacío');
    if (!args.jwt || !args.jwt) {
        throw new apollo_server_express_1.UserInputError('Jwt no puede estar vacío');
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (secret) {
            const validado = jsonwebtoken_1.default.verify(args.jwt, secret);
            const db = database_1.Database.Instance();
            const empleadoValidado = yield db.EmployeeDBController.CollectionModel.findOne({ _id: validado._id }).exec();
            if (empleadoValidado) {
                return {
                    validado: true
                };
            }
            return {
                validado: false
            };
        }
        return { validado: false };
    }
    catch (err) {
        return { validado: false };
    }
});
exports.jwtValidatorResolver = jwtValidatorResolver;
