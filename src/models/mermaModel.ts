import { Schema, model, Model } from 'mongoose';
import { IEmployee } from '../types/Empleado';
import { IMerma } from '../types/Merma';
import { IProductoMermado } from '../types/Producto';

export class Merma {
    private modelo: Model<IMerma>;

    constructor() {
        const ProductoMermadoSchema = new Schema({
            _id: { type: Schema.Types.ObjectId, requiered: true },
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
        }, { strict: true, timestamps: false }) as Schema<IProductoMermado>;

        const EmpleadoSchema = new Schema({
            nombre: { type: String, requiered: true },
            apellidos: { type: String, requiered: true },
            dni: { type: String, requiered: true },
            email: { type: String, requiered: true },
            rol: { type: String, requiered: true },
        }, { strict: true, timestamps: false }) as Schema<IEmployee>;

        const MermaSchema = new Schema({
            productos: { type: [ProductoMermadoSchema], required: true },
            creadoPor: { type: EmpleadoSchema, required: true },
            costeProductos: { type: Number, requiered: false },
            ventasPerdidas: { type: Number, requiered: false },
            beneficioPerdido: { type: Number, requiered: false },
        }, { strict: true, timestamps: true }) as Schema<IMerma>;

        this.modelo = model<IMerma>('Merma', MermaSchema);
    }

    public get Model(): Model<IMerma> {
        return this.modelo;
    }
}
