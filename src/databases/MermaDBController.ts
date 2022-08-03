import mongoose from 'mongoose';
import { IMerma } from '../types/Merma';

export class MermaDBController {

    public CollectionModel: mongoose.Model<IMerma>;

    constructor(modelo: mongoose.Model<IMerma>) {
        this.CollectionModel = modelo
    }
}
