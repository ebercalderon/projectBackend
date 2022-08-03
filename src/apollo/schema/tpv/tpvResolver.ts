import { UserInputError } from "apollo-server-express";
import { Database } from "../../../databases/database";
import { TPVFind, TPVsFind } from "../../../types/types";
import jwt from "jsonwebtoken";
import { IEmployee } from "../../../types/Empleado";

export const tpvResolver = async (parent: any, args: TPVFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if ((!args.find.nombre && !args.find._id)) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');
    const db = Database.Instance();

    if (!args.find.empleadoId) {
        if (args.find._id) { return await db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec(); }

        return await db.TPVDBController.CollectionModel.findOne({ nombre: args.find.nombre }).exec();
    }

    const empleado = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.find.empleadoId });

    if (args.find.nombre) {
        const tpv = await db.TPVDBController.CollectionModel.findOne({ nombre: args.find.nombre }).exec();

        if (tpv) {
            if (empleado) {
                const empleadoClean = {
                    _id: empleado._id,
                    nombre: empleado.nombre,
                    apellidos: empleado.apellidos,
                    rol: empleado.rol,
                    email: empleado.email,
                    dni: "",
                    genero: "",
                    hashPassword: "",
                    horasPorSemana: 0
                } as IEmployee

                tpv.enUsoPor = empleadoClean;
            }

            return tpv;
        }

        return undefined;
    }

    if (args.find._id) {
        const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();

        if (tpv) {
            if (empleado) {
                const empleadoClean = {
                    _id: empleado._id,
                    nombre: empleado.nombre,
                    apellidos: empleado.apellidos,
                    rol: empleado.rol,
                    email: empleado.email,
                    dni: "",
                    genero: "",
                    hashPassword: "",
                    horasPorSemana: 0
                } as IEmployee

                tpv.enUsoPor = empleadoClean;
            }

            return tpv;
        }

        return undefined;
    }

    return await db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
}

export const tpvsResolver = async (parent: any, args: TPVsFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const tpv = await db.TPVDBController.CollectionModel.find({})
            .limit(150)
            .exec();

        return tpv;
    }

    if (args.find) {
        const tpv = await db.TPVDBController.CollectionModel.find({ libre: args.find.libre })
            .limit(150)
            .exec();
        return tpv;
    }

    return [];
}

export const addTpvResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

}

export const deleteTpvResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();
}

export const updateTpvResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // No se puede actualizar si la tpv está ocupada

}

export const ocupyTpvResolver = async (root: any, args: { idEmpleado: string, idTPV: string, cajaInicial: number }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Secret Key
    const secret = process.env.JWT_SECRET;

    if (secret) {
        const empleado = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleado }).exec();
        if (!empleado) { throw new UserInputError('Empleado no encontrado'); }

        const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV }).exec();
        if (!tpv) throw new UserInputError('TPV no encontrada');
        if (!tpv.libre) throw new UserInputError('TPV actualmente ocupada por otro empleado');

        const empleadoClean = {
            _id: empleado._id,
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            rol: empleado.rol,
            email: empleado.email,
            dni: "",
            genero: "",
            hashPassword: "",
            horasPorSemana: 0
        } as IEmployee;

        await tpv.updateOne({ libre: false, enUsoPor: empleadoClean, cajaInicial: args.cajaInicial });

        //Login JWT payload
        const payload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol, TPV: tpv._id };
        const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;

        // Create Token Expires in 1 hour
        const token = await jwt.sign(payload, secret, {
            expiresIn: 3600 * Number(jwtHoursDuration)
        });

        // Finally return user token
        return {
            token: `Bearer ${token}`,
            successful: true
        };
    }

    return {
        token: `Bearer`,
        successful: false
    }
}

export const freeTpvResolver = async (root: any, args: { idEmpleado: string, idTPV: string }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Secret Key
    const secret = process.env.JWT_SECRET;

    if (secret) {
        const empleado = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleado }).exec();
        if (!empleado) { throw new UserInputError('Empleado no encontrado'); }

        const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV }).exec();
        if (!tpv) throw new UserInputError('TPV no encontrada');
        if (tpv.libre) throw new UserInputError('TPV actualmente ocupada por otro empleado');

        const empleadoClean = {
            _id: empleado._id,
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            rol: empleado.rol,
            email: empleado.email,
            dni: "",
            genero: "",
            hashPassword: "",
            horasPorSemana: 0
        } as IEmployee;
        await tpv.updateOne({ libre: true, enUsoPor: empleadoClean });

        //Login JWT payload
        const payload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol };
        const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;

        // Create Token Expires in 1 hour
        const token = await jwt.sign(payload, secret, {
            expiresIn: 3600 * Number(jwtHoursDuration)
        });

        // Finally return user token
        return {
            token: `Bearer ${token} `,
            successful: true
        };
    }

    return {
        token: `Bearer`,
        successful: false
    };
}

