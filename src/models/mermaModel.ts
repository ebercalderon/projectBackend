import { Schema, model, Model } from 'mongoose';
import { IEmployee } from '../types/Empleado';
import { IMerma } from '../types/Merma';
import { ILostProduct } from '../types/Producto';

export class Merma {
    private modelo: Model<IMerma>;

    constructor() {
        const ProductoMermadoSchema = new Schema({
            cantidadMerma: { type: Number, required: true },
            nombre: { type: String, requiered: true },
            familia: { type: String, requiered: true },
            proveedor: { type: String, requiered: true },
            precioCompra: { type: Number, requiered: true },
            precioVenta: { type: Number, requiered: true },
            iva: { type: Number, requiered: true },
            margen: { type: Number, requiered: true },
            ean: { type: String, requiered: true }

        }, { strict: true, timestamps: false }) as Schema<ILostProduct>;

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

        const MermaSchema = new Schema({
            productos: { type: [ProductoMermadoSchema], required: true },
            creadoPor: { type: EmpleadoSchema, required: true },
            modificadoPor: { type: EmpleadoSchema, required: true },

        }, { strict: true, timestamps: true }) as Schema<IMerma>;

        this.modelo = model<IMerma>('Merma', MermaSchema);
    }

    public get Model(): Model<IMerma> {
        return this.modelo;
    }
}
