"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proveedor = void 0;
const mongoose_1 = require("mongoose");
class Proveedor {
    constructor() {
        const ContactoSchema = new mongoose_1.Schema({
            nombre: { type: String, required: true },
            telefono: { type: String, required: false },
            email: { type: String, required: false },
        }, { strict: true, _id: false });
        const ProveedorSchema = new mongoose_1.Schema({
            nombre: { type: String, required: true },
            cif: { type: String, required: true },
            direccion: { type: String, required: false },
            localidad: { type: String, required: false },
            provincia: { type: String, required: false },
            cp: { type: String, required: false },
            pais: { type: String, required: false },
            telefono: { type: String, required: false },
            email: { type: String, required: false },
            contacto: { type: ContactoSchema, required: false },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Proveedor', ProveedorSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Proveedor = Proveedor;
exports.default = Proveedor;
