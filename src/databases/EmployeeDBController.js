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
exports.EmployeeDBController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class EmployeeDBController {
    constructor(modelo) {
        this.CollectionModel = modelo;
    }
    CreateEmployee(Empleado, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salt = bcryptjs_1.default.genSaltSync(10);
                let hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                const employeeToAdd = new this.CollectionModel({
                    nombre: Empleado.nombre,
                    apellidos: Empleado.apellidos,
                    dni: Empleado.dni,
                    email: Empleado.email,
                    rol: Empleado.rol,
                    hashPassword: hashedPassword,
                    fechaAlta: Empleado.fechaAlta || new Date(Date.now()),
                });
                const empleadoExistente = yield this.CollectionModel.exists({
                    $or: [
                        { dni: Empleado.dni },
                        { email: Empleado.email }
                    ]
                });
                if (empleadoExistente) {
                    throw `El empleado con correo ${Empleado.email} y/o DNI ${Empleado.dni} ya existe`;
                }
                yield employeeToAdd.save().catch(() => { return false; });
                return true;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
    UpdateEmployee(Empleado, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empleadoEnDb = yield this.CollectionModel.exists({ _id: Empleado._id });
                if (empleadoEnDb === null) {
                    return false;
                }
                if (!password) {
                    const updatedEmpleado = {
                        nombre: Empleado.nombre,
                        apellidos: Empleado.apellidos,
                        dni: Empleado.dni,
                        rol: Empleado.rol,
                    };
                    const resultadoUpdate = yield this.CollectionModel.updateOne({ _id: Empleado._id }, { $set: updatedEmpleado });
                    if (resultadoUpdate.modifiedCount > 0) {
                        return true;
                    }
                    return false;
                }
                const emp = yield this.CollectionModel.findOne({ _id: Empleado._id });
                const salt = bcryptjs_1.default.genSaltSync(10);
                let hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                const updatedEmpleado = {
                    nombre: Empleado.nombre || (emp === null || emp === void 0 ? void 0 : emp.nombre),
                    apellidos: Empleado.apellidos || (emp === null || emp === void 0 ? void 0 : emp.apellidos),
                    dni: Empleado.dni || (emp === null || emp === void 0 ? void 0 : emp.dni),
                    rol: Empleado.rol || (emp === null || emp === void 0 ? void 0 : emp.rol),
                    hashedPassword: hashedPassword
                };
                const resultadoUpdate = yield this.CollectionModel.updateOne({ _id: Empleado._id }, { $set: updatedEmpleado });
                if (resultadoUpdate.modifiedCount > 0) {
                    return true;
                }
                return false;
            }
            catch (err) {
                console.error(err);
                return false;
            }
        });
    }
}
exports.EmployeeDBController = EmployeeDBController;
