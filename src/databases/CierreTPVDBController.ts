import mongoose from 'mongoose';
import { ICierreTPV } from '../types/TPV';

export class CierreTPVDBController {

    public CollectionModel: mongoose.Model<ICierreTPV>;

    constructor(modelo: mongoose.Model<ICierreTPV>) {
        this.CollectionModel = modelo
    }
}
