import mongoose from 'mongoose';
import { ISale } from '../types/Venta';
export class SaleDBController {

	public CollectionModel: mongoose.Model<ISale>;

	constructor(modelo: mongoose.Model<ISale>) {
		this.CollectionModel = modelo
	}
}
