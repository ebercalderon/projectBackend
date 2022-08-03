import mongoose from 'mongoose';
import { IDevolucion } from '../types/Devolucion';

export class DevolucionDBController {

    public CollectionModel: mongoose.Model<IDevolucion>;

    constructor(modelo: mongoose.Model<IDevolucion>) {
        this.CollectionModel = modelo
    }
}
