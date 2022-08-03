import { Schema, model, Model } from 'mongoose';
import { IEmployee } from '../types/Empleado';

export class Empleado {
  private modelo: Model<IEmployee>;

  constructor() {
    const EmpleadoSchema = new Schema({
      nombre: { type: String, required: true },
      apellidos: { type: String, required: true },
      dni: { type: String, required: true, unique: true },
      rol: { type: String, required: true },
      genero: { type: String, required: false },
      email: { type: String, required: true },
      hashPassword: { type: String, required: true },
      horasPorSemana: { type: Number, required: false },
      fechaAlta: { type: Date, required: true },
    }, { strict: true });

    this.modelo = model<IEmployee>('Empleados', EmpleadoSchema);
  }

  public get Model(): Model<IEmployee> {
    return this.modelo;
  }
}
