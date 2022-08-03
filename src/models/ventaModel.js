"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venta = void 0;
const mongoose_1 = require("mongoose");
class Venta {
    constructor() {
        const ProductoVendidoSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            familia: { type: String, requiered: true },
            proveedor: { type: String, requiered: true },
            precioCompra: { type: Number, requiered: true },
            precioVenta: { type: Number, requiered: true },
            precioFinal: { type: Number, requiered: true },
            cantidadVendida: { type: Number, requiered: true },
            dto: { type: Number, requiered: true },
            iva: { type: Number, requiered: true },
            margen: { type: Number, requiered: true },
            ean: { type: String, requiered: true }
        }, { strict: true, timestamps: false });
        const ClienteSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            calle: { type: String, requiered: true },
            cp: { type: String, requiered: true },
            nif: { type: String, requiered: true },
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
        const VentaSchema = new mongoose_1.Schema({
            productos: { type: [ProductoVendidoSchema], required: true },
            dineroEntregadoEfectivo: { type: Number, required: true },
            dineroEntregadoTarjeta: { type: Number, required: true },
            precioVentaTotalSinDto: { type: Number, required: true },
            precioVentaTotal: { type: Number, required: true },
            cambio: { type: Number, required: true },
            cliente: { type: ClienteSchema, required: true },
            vendidoPor: { type: EmpleadoSchema, required: true },
            modificadoPor: { type: EmpleadoSchema, required: true },
            tipo: { type: String, required: true },
            descuentoEfectivo: { type: Number, required: true },
            descuentoPorcentaje: { type: Number, required: true },
            tpv: { type: mongoose_1.Types.ObjectId, ref: 'TPV', required: true },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Venta', VentaSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Venta = Venta;
exports.default = Venta;
