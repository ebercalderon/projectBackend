"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Devolucion = void 0;
const mongoose_1 = require("mongoose");
class Devolucion {
    constructor() {
        const ProductoVendidoSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            familia: { type: String, requiered: true },
            proveedor: { type: String, requiered: true },
            precioCompra: { type: Number, requiered: true },
            precioVenta: { type: Number, requiered: true },
            precioFinal: { type: Number, requiered: true },
            cantidadDevuelta: { type: Number, requiered: true },
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
            hashPassword: { type: String, requiered: false },
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
        const DevolucionSchema = new mongoose_1.Schema({
            productosDevueltos: { type: [ProductoVendidoSchema], required: true },
            dineroDevuelto: { type: Number, required: true },
            ventaOriginal: { type: VentaSchema, required: true },
            tpv: { type: mongoose_1.Types.ObjectId, ref: 'TPV', required: true },
            cliente: { type: ClienteSchema, required: true },
            trabajador: { type: EmpleadoSchema, required: true },
            modificadoPor: { type: EmpleadoSchema, required: true },
        }, { strict: true, timestamps: true });
        this.modelo = (0, mongoose_1.model)('Devolucion', DevolucionSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Devolucion = Devolucion;
exports.default = Devolucion;
