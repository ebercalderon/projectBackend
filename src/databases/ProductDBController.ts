import mongoose from 'mongoose';
import { IProduct } from '../types/Producto';
export class ProductoDBController {

	public CollectionModel: mongoose.Model<IProduct>;

	constructor(modelo: mongoose.Model<IProduct>) {
		this.CollectionModel = modelo
	}
}
