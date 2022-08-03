"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
const mongoose_1 = require("mongoose");
class Producto {
    constructor() {
        const ProductSchema = new mongoose_1.Schema({
            nombre: { type: String, required: true },
            proveedor: { type: String, required: false },
            familia: { type: String, required: false },
            precioVenta: { type: Number, required: true },
            precioCompra: { type: Number, required: true },
            iva: { type: Number, required: false },
            ean: { type: String, required: true },
            margen: { type: Number, required: false },
            alta: { type: Boolean, required: false },
            cantidad: { type: Number, required: false },
            cantidadRestock: { type: Number, required: false },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Producto', ProductSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Producto = Producto;
