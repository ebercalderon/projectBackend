import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import { Database } from "../../../databases/database"
import { IEmployee } from "../../../types/Empleado";
import { EmpleadoFind, EmpleadosFind } from "../../../types/types";

export const empleadoResolver = async (parent: any, args: EmpleadoFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');

    const db = Database.Instance();

    if (args.find._id) {
        let e = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.find._id }).exec();

        if (e) { e.hashPassword = "undefined"; return e; }
    }

    if (args.find.dni) {
        let e = await db.EmployeeDBController.CollectionModel.findOne({ dni: args.find.dni }).exec();

        if (e) { e.hashPassword = "undefined"; return e; }
    }

    if (args.find.nombre) {
        let e = await db.EmployeeDBController.CollectionModel.findOne({ nombre: { "$regex": args.find.nombre, "$options": "i" } }).exec();

        if (e) { e.hashPassword = "undefined"; return e; }
    }

    return null;
}

export const empleadosResolver = async (parent: any, args: EmpleadosFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Comprueba si find es null, undefined o vacío
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        let empleados = await db.EmployeeDBController.CollectionModel.find({}).limit(args.limit || 3000).exec();

        if (empleados) {
            empleados.forEach((e) => {
                e.hashPassword = "undefined";
            })
            return empleados;
        }
    }

    if (args.find?._ids) {
        let empleados = await db.EmployeeDBController.CollectionModel.find({ _id: args.find._ids })
            .limit(args.limit || 3000)
            .exec();

        if (empleados) {
            empleados.forEach((e) => {
                e.hashPassword = "undefined";
            })
            return empleados;
        }
    }

    if (args.find?.nombre) {
        let empleados = await db.EmployeeDBController.CollectionModel.find({ nombre: args.find.nombre })
            .limit(args.limit || 3000)
            .exec();

        if (empleados) {
            empleados.forEach((e) => {
                e.hashPassword = "undefined";
            })
            return empleados;
        }
    }

    if (args.find?.rol) {
        let empleados = await db.EmployeeDBController.CollectionModel.find({ rol: args.find.rol })
            .limit(args.limit || 3000)
            .exec();

        if (empleados) {
            empleados.forEach((e) => {
                e.hashPassword = "undefined";
            })
            return empleados;
        }
    }

    if (args.find?.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose.Types.ObjectId.isValid(query);

        let empleados = {};
        if (isQueryValidId) {
            empleados = await db.EmployeeDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();
        }
        else {
            empleados = await db.EmployeeDBController.CollectionModel.find({
                $or: [
                    { nombre: { "$regex": query, "$options": "i" } },
                    { apellidos: { "$regex": query, "$options": "i" } },
                    { rol: { "$regex": query, "$options": "i" } },
                    { email: { "$regex": query, "$options": "i" } }
                ]
            })
                .limit(args.limit || 150)
                .exec();
        }

        return empleados;
    }

    return [];
}

export const addEmpleadoResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    try {
        const db = Database.Instance();
        const fecha = new Date(Date.now());

        const Empleado = {
            nombre: args.empleadoInput.nombre,
            apellidos: args.empleadoInput.apellidos,
            dni: args.empleadoInput.dni,
            rol: args.empleadoInput.rol,
            email: args.empleadoInput.email,
            fechaAlta: fecha
        } as IEmployee;
        const empleadoAñadido = await db.EmployeeDBController.CreateEmployee(Empleado, args.empleadoInput.password)

        if (empleadoAñadido) {
            return { message: "Empleado añadido correctamente", successful: true }
        }
        else {
            return { message: "No se ha podido añadir el empleado", successful: false }
        }
    }
    catch (err) {
        return { message: "Error al añadir el empleado: " + err, successful: false }
    }
}

export const deleteEmpleadoResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const db = Database.Instance();

        const res = await db.EmployeeDBController.CollectionModel.deleteOne({ _id: args._id });

        if (res.deletedCount > 0) {
            return { message: "Empleado eliminado correctamente", successful: true }
        }

        return { message: "No se ha podido eliminar el empleado", successful: false }
    }
    catch (err) {
        return { message: "Error al eliminar el empleado", successful: false }
    }
}

export const updateEmpleadoResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    try {
        const db = Database.Instance();

        const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
        if (!isQueryValidId) {
            return { message: "ID del empleado inválido", successful: false }
        }

        const updatedEmpleado = {
            _id: args._id,
            nombre: args.empleadoInput.nombre,
            apellidos: args.empleadoInput.apellidos,
            dni: args.empleadoInput.dni,
            rol: args.empleadoInput.rol,
        } as unknown as IEmployee;

        const actualizadoCorrectamente = await db.EmployeeDBController.UpdateEmployee(updatedEmpleado, args.empleadoInput.password)
        if (actualizadoCorrectamente) {
            return { message: "Empleado actualizado correctamente", successful: true }
        }

        return { message: "No se ha podido actualizar el empleado", successful: false }
    }
    catch (err) {
        return { message: "Error al actualizar el empleado", successful: false }
    }
}
