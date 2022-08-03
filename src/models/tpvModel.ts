import { Schema, model, Model, Types } from 'mongoose';
import { IEmployee } from '../types/Empleado';
import { ITPV } from '../types/TPV';


export class TPV {
    private modelo: Model<ITPV>;

    constructor() {
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

        const TPVSchema = new Schema({
            nombre: { type: String, requiered: true },
            enUsoPor: { type: EmpleadoSchema, requiered: true },
            libre: { type: Boolean, requiered: true },
            cajaInicial: { type: Number, requiered: true }
        }, { strict: true, timestamps: true }) as Schema<ITPV>;

        this.modelo = model<ITPV>('TPV', TPVSchema);
    }

    public get Model(): Model<ITPV> {
        return this.modelo;
    }
}
