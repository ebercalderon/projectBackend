import { Schema, model, Model, Types } from 'mongoose';
import { IClient } from '../types/Cliente';
import { IEmployee } from '../types/Empleado';
import { ISoldProduct } from '../types/Producto';
import { ISale } from '../types/Venta';


export class Venta {
    private modelo: Model<ISale>;

    constructor() {
        const ProductoVendidoSchema = new Schema({
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
        }, { strict: true, timestamps: false }) as Schema<ISoldProduct>;

        const ClienteSchema = new Schema({
            nombre: { type: String, requiered: true },
            calle: { type: String, requiered: true },
            cp: { type: String, requiered: true },
            nif: { type: String, requiered: true },
        }, { strict: true, timestamps: false }) as Schema<IClient>;

        const EmpleadoSchema = new Schema({
            nombre: { type: String, requiered: true },
            apellidos: { type: String, requiered: true },
            dni: { type: String, requiered: true },
            email: { type: String, requiered: true },
            fechaAlta: { type: Date, required: false },
            genero: { type: String, requiered: false },
            hashPassword: { type: String, requiered: false },
            horasPorSemana: { type: Number, requiered: false },
            rol: { type: String, requiered: true },
        }, { strict: true, timestamps: false }) as Schema<IEmployee>;

        const VentaSchema = new Schema({
            productos: { type: [ProductoVendidoSchema], required: true },
            numFactura: { type: String, required: true },
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
            tpv: { type: Types.ObjectId, ref: 'TPV', required: true },
        }, { strict: true, timestamps: true }) as Schema<ISale>;
        this.modelo = model<ISale>('Venta', VentaSchema);
    }

    public get Model(): Model<ISale> {
        return this.modelo;
    }
}

export default Venta;
