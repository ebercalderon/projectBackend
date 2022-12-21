import { Schema, model, Model } from 'mongoose';
import { IProveedor, IProveedorContacto } from '../types/Proveedor';

export class Proveedor {
    private modelo: Model<IProveedor>;

    constructor() {
        const ContactoSchema = new Schema({
            nombre: { type: String, required: true },
            telefono: { type: String, required: false },
            email: { type: String, required: false },
        }, { strict: true, _id: false }) as Schema<IProveedorContacto>;

        const ProveedorSchema = new Schema({
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
        }, { strict: true, timestamps: true }) as Schema<IProveedor>;

        this.modelo = model<IProveedor>('Proveedor', ProveedorSchema);
    }

    public get Model(): Model<IProveedor> {
        return this.modelo;
    }
}

export default Proveedor;
