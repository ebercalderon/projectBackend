"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merma = void 0;
const mongoose_1 = require("mongoose");
class Merma {
    constructor() {
        const ProductoMermadoSchema = new mongoose_1.Schema({
            cantidadMerma: { type: Number, required: true },
            nombre: { type: String, requiered: true },
            familia: { type: String, requiered: true },
            proveedor: { type: String, requiered: true },
            precioCompra: { type: Number, requiered: true },
            precioVenta: { type: Number, requiered: true },
            iva: { type: Number, requiered: true },
            margen: { type: Number, requiered: true },
            ean: { type: String, requiered: true }
        }, { strict: true, timestamps: false });
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
        const MermaSchema = new mongoose_1.Schema({
            productos: { type: [ProductoMermadoSchema], required: true },
            creadoPor: { type: EmpleadoSchema, required: true },
            modificadoPor: { type: EmpleadoSchema, required: true },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Merma', MermaSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Merma = Merma;
