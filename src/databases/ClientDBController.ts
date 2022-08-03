import mongoose from 'mongoose';
import { IClient } from '../types/Cliente';

export class ClientDBController {

	public CollectionModel: mongoose.Model<IClient>;

	constructor(modelo: mongoose.Model<IClient>) {
		this.CollectionModel = modelo
	}
}
