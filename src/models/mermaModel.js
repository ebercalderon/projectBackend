"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Merma = void 0;
const mongoose_1 = require("mongoose");
class Merma {
    constructor() {
        const ProductoMermadoSchema = new mongoose_1.Schema({
            _id: { type: mongoose_1.Schema.Types.ObjectId, requiered: true },
            nombre: { type: String, requiered: true },
            proveedor: { type: String, requiered: true },
            cantidad: { type: Number, required: true },
            familia: { type: String, requiered: true },
            margen: { type: Number, requiered: true },
            ean: { type: String, requiered: true },
            iva: { type: Number, requiered: true },
            precioCompra: { type: Number, requiered: true },
            precioVenta: { type: Number, requiered: true },
            motivo: { type: String, requiered: true },
        }, { strict: true, timestamps: false });
        const EmpleadoSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            apellidos: { type: String, requiered: true },
            dni: { type: String, requiered: true },
            email: { type: String, requiered: true },
            rol: { type: String, requiered: true },
        }, { strict: true, timestamps: false });
        const MermaSchema = new mongoose_1.Schema({
            productos: { type: [ProductoMermadoSchema], required: true },
            creadoPor: { type: EmpleadoSchema, required: true },
            costeProductos: { type: Number, requiered: false },
            ventasPerdidas: { type: Number, requiered: false },
            beneficioPerdido: { type: Number, requiered: false },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Merma', MermaSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Merma = Merma;
