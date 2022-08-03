import mongoose = require('mongoose');
import dotenv = require('dotenv');
import { Producto } from '../models/productoModel';
import { Venta } from '../models/ventaModel';
import { ErrorRequestHandler } from 'express';
import { Cliente } from '../models/clienteModel';
import { ProductoDBController } from './ProductDBController';
import { ClientDBController } from './ClientDBController';
import { SaleDBController } from './SaleDBController';
import { EmployeeDBController } from './EmployeeDBController';
import { Empleado } from '../models/employeeModel';
import { CierreTPVDBController } from './CierreTPVDBController';
import { CierreTPV } from '../models/cierreTPVModel';
import { TPV } from '../models/tpvModel';
import { TPVDBController } from './TPVDBController';
import { IClient } from '../types/Cliente';
import { DevolucionDBController } from './DevolucionDBController';
import Devolucion from '../models/devolucionModel';
import { MermaDBController } from './MermaDBController';
import { Merma } from '../models/mermaModel';
import { IEmployee } from '../types/Empleado';
import { ITPV } from '../types/TPV';
import { ProveedorDBController } from './ProveedorDBController';
import Proveedor from '../models/proveedorModel';

mongoose.Promise = global.Promise;

dotenv.config();

const dbInformation: any = {
	mongo: mongoose,
	url: process.env.MONGO_URI === "" ? "mongodb://localhost:27017/" : process.env.MONGO_URI,
	dbName: process.env.DATABASE_NAME == "" ? "erp_db" : process.env.DATABASE_NAME,
};
export class Database {
	private static instance: Database;
	private db: mongoose.Mongoose;

	public ProductDBController: ProductoDBController;
	public VentasDBController: SaleDBController;
	public ClientDBController: ClientDBController;
	public EmployeeDBController: EmployeeDBController;
	public TPVDBController: TPVDBController;
	public CierreTPVDBController: CierreTPVDBController;
	public DevolucionDBController: DevolucionDBController;
	public MermaDBController: MermaDBController;
	public ProveedorDBController: ProveedorDBController;

	private constructor() {
		this.db = dbInformation.mongo;

		this.ProductDBController = new ProductoDBController(new Producto().Model);
		this.VentasDBController = new SaleDBController(new Venta().Model);
		this.ClientDBController = new ClientDBController(new Cliente().Model);
		this.EmployeeDBController = new EmployeeDBController(new Empleado().Model);
		this.CierreTPVDBController = new CierreTPVDBController(new CierreTPV().Model);
		this.TPVDBController = new TPVDBController(new TPV().Model);
		this.DevolucionDBController = new DevolucionDBController(new Devolucion().Model);
		this.MermaDBController = new MermaDBController(new Merma().Model);
		this.ProveedorDBController = new ProveedorDBController(new Proveedor().Model);

		this.db.connect(dbInformation.url + dbInformation.dbName).then(() => {
			console.log("¡Conexión realizada con la base de datos!");
		}).catch((err: ErrorRequestHandler) => {
			console.log("¡No se pudo realizar la conexión con la base de datos!", err);
			process.exit();
		}).then(async () => {
			await this.ClientDBController.CollectionModel.findOne({ nombre: "General" }).exec().then((clienteGeneral) => {
				if (!clienteGeneral) {
					const cliente = { nombre: "General", calle: "General", nif: "General", cp: "General" } as IClient
					this.ClientDBController.CollectionModel.create(cliente);
				}
			});
			const numEmpleados = await this.EmployeeDBController.CollectionModel.countDocuments({});
			if (numEmpleados <= 0) {
				const empleado = {
					nombre: "Administrador",
					apellidos: "Admin",
					dni: "Administrador",
					rol: "Administrador",
					email: "admin@erp.com"
				} as IEmployee
				const pw = "admin"
				await this.EmployeeDBController.CreateEmployee(empleado, pw);
			}

			const numTpvs = await this.TPVDBController.CollectionModel.countDocuments({});
			if (numTpvs <= 0) {
				const TPV1 = {
					cajaInicial: 100,
					nombre: "TPV1",
					libre: true,
					enUsoPor: {
						nombre: "Administrador",
						apellidos: "Admin",
						dni: "Administrador",
						rol: "Administrador",
						email: "admin@erp.com"
					} as IEmployee
				} as unknown as ITPV
				const TPV2 = {
					cajaInicial: 100,
					nombre: "TPV2",
					libre: true,
					enUsoPor: {
						nombre: "Administrador",
						apellidos: "Admin",
						dni: "Administrador",
						rol: "Administrador",
						email: "admin@erp.com"
					} as IEmployee
				} as unknown as ITPV

				await this.TPVDBController.CollectionModel.create(TPV1);
				await this.TPVDBController.CollectionModel.create(TPV2);
			}
		});
	}

	public static Instance(): Database {
		if (!this.instance) {
			this.instance = new Database();
		}
		return this.instance;
	}

	public get MongooseInstance(): mongoose.Mongoose {
		return this.db;
	}
}
