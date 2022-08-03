import { Schema, model, Model } from 'mongoose';
import { IClient } from '../types/Cliente';

export class Cliente {
    private modelo: Model<IClient>;

    constructor() {
        const ClientSchema = new Schema({
            nif: { type: String, required: true },
            nombre: { type: String, required: true },
            calle: { type: String, required: true },
            cp: { type: String, required: true },
        }, { strict: true }) as Schema<IClient>;

        this.modelo = model<IClient>('Cliente', ClientSchema);
    }

    public get Model(): Model<IClient> {
        return this.modelo;
    }
}