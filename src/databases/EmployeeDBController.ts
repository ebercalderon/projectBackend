import mongoose from 'mongoose';
import { IEmployee } from '../types/Empleado';
import bcrypt from "bcryptjs";
export class EmployeeDBController {

	public CollectionModel: mongoose.Model<IEmployee>;

	constructor(modelo: mongoose.Model<IEmployee>) {
		this.CollectionModel = modelo
	}

	async CreateEmployee(Empleado: IEmployee, password: string): Promise<boolean> {
		try {
			const salt = bcrypt.genSaltSync(10);
			let hashedPassword = await bcrypt.hash(password, salt);

			// Crea el empleado
			const employeeToAdd: mongoose.Document<IEmployee> = new this.CollectionModel({
				nombre: Empleado.nombre,
				apellidos: Empleado.apellidos,
				dni: Empleado.dni,
				genero: Empleado.genero,
				email: Empleado.email,
				rol: Empleado.rol,
				hashPassword: hashedPassword,
				horasPorSemana: Empleado.horasPorSemana,
				fechaAlta: Empleado.fechaAlta || new Date(Date.now()),
			});

			const empleadoExistente = await this.CollectionModel.exists({
				$or: [
					{ dni: Empleado.dni },
					{ email: Empleado.email }
				]
			});
			if (empleadoExistente) { throw `El empleado con correo ${Empleado.email} y/o DNI ${Empleado.dni} ya existe` }

			await employeeToAdd.save().catch(() => { return false; });
			return true;
		}
		catch (err) {
			console.error(err);
			return false;
		}
	}

	async UpdateEmployee(Empleado: IEmployee, password?: string): Promise<boolean> {
		try {
			const empleadoEnDb = await this.CollectionModel.exists({ _id: Empleado._id });
			if (empleadoEnDb === null) { return false; }

			if (!password) {
				const updatedEmpleado = {
					nombre: Empleado.nombre,
					apellidos: Empleado.apellidos,
					dni: Empleado.dni,
					rol: Empleado.rol,
				} as unknown as IEmployee;

				const resultadoUpdate = await this.CollectionModel.updateOne({ _id: Empleado._id }, { $set: updatedEmpleado });

				if (resultadoUpdate.modifiedCount > 0) {
					return true
				}

				return false
			}

			const emp = await this.CollectionModel.findOne({ _id: Empleado._id });
			const salt = bcrypt.genSaltSync(10);
			let hashedPassword = await bcrypt.hash(password, salt);

			const updatedEmpleado = {
				nombre: Empleado.nombre || emp?.nombre,
				apellidos: Empleado.apellidos || emp?.apellidos,
				dni: Empleado.dni || emp?.dni,
				rol: Empleado.rol || emp?.rol,
				hashedPassword: hashedPassword
			} as unknown as IEmployee;

			const resultadoUpdate = await this.CollectionModel.updateOne({ _id: Empleado._id }, { $set: updatedEmpleado });

			if (resultadoUpdate.modifiedCount > 0) { return true }
			return false;
		}
		catch (err) {
			console.error(err);
			return false;
		}
	}

	CheckIntegridadEmail() {

	}

	CheckIntegridadDNI() {

	}
}
