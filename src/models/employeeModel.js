"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empleado = void 0;
const mongoose_1 = require("mongoose");
class Empleado {
    constructor() {
        const EmpleadoSchema = new mongoose_1.Schema({
            nombre: { type: String, required: true },
            apellidos: { type: String, required: true },
            dni: { type: String, required: true, unique: true },
            rol: { type: String, required: true },
            genero: { type: String, required: false },
            email: { type: String, required: true },
            hashPassword: { type: String, required: true },
            horasPorSemana: { type: Number, required: false },
            fechaAlta: { type: Date, required: true },
        }, { strict: true });
        this.modelo = (0, mongoose_1.model)('Empleados', EmpleadoSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Empleado = Empleado;
