import { Schema, model, Model, Types } from 'mongoose';
import { IProveedor } from '../types/Proveedor';

export class Proveedor {
    private modelo: Model<IProveedor>;

    constructor() {
        const ProveedorSchema = new Schema({
            nombre: { type: String, required: true },
            direccion: { type: String, required: true },
            localidad: { type: String, required: true },
            provincia: { type: String, required: true },
            cp: { type: String, required: true },
            pais: { type: String, required: true },
            telefono: { type: String, required: true },
            email: { type: String, required: true },
            contacto: { type: String, required: true },
        }, { strict: true, timestamps: true }) as Schema<IProveedor>;

        this.modelo = model<IProveedor>('Proveedor', ProveedorSchema);
    }

    public get Model(): Model<IProveedor> {
        return this.modelo;
    }
}

export default Proveedor;
