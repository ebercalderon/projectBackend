"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TPV = void 0;
const mongoose_1 = require("mongoose");
class TPV {
    constructor() {
        const EmpleadoSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            apellidos: { type: String, requiered: true },
            dni: { type: String, requiered: true },
            email: { type: String, requiered: true },
            fechaAlta: { type: Date, required: false },
            genero: { type: String, requiered: false },
            hashPassword: { type: String, requiered: false },
            horasPorSemana: { type: Number, requiered: false },
            rol: { type: String, requiered: true },
        }, { strict: true, timestamps: false });
        const TPVSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            enUsoPor: { type: EmpleadoSchema, requiered: true },
            libre: { type: Boolean, requiered: true },
            cajaInicial: { type: Number, requiered: true }
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('TPV', TPVSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.TPV = TPV;
