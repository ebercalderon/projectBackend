"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proveedor = void 0;
const mongoose_1 = require("mongoose");
class Proveedor {
    constructor() {
        const ProveedorSchema = new mongoose_1.Schema({
            nombre: { type: String, required: true },
            direccion: { type: String, required: true },
            localidad: { type: String, required: true },
            provincia: { type: String, required: true },
            cp: { type: String, required: true },
            pais: { type: String, required: true },
            telefono: { type: String, required: true },
            email: { type: String, required: true },
            contacto: { type: String, required: true },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Proveedor', ProveedorSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Proveedor = Proveedor;
exports.default = Proveedor;
