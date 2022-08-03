import mongoose from 'mongoose';
import { IProveedor } from '../types/Proveedor';

export class ProveedorDBController {

    public CollectionModel: mongoose.Model<IProveedor>;

    constructor(modelo: mongoose.Model<IProveedor>) {
        this.CollectionModel = modelo
    }
}
