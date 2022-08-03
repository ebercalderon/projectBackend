import mongoose from 'mongoose';
import { ITPV } from '../types/TPV';

export class TPVDBController {

    public CollectionModel: mongoose.Model<ITPV>;

    constructor(modelo: mongoose.Model<ITPV>) {
        this.CollectionModel = modelo
    }
}
