import { UserInputError } from "apollo-server-express";
import { Database } from "../../../databases/database";
import { JWTPayload, TPVFind, TPVsFind } from "../../../types/types";
import jwt from "jsonwebtoken";
import { IEmployee } from "../../../types/Empleado";
import { ITPV } from "../../../types/TPV";
import { Types, UpdateQuery } from "mongoose";

export const tpvResolver = async (parent: any, args: TPVFind, context: any, info: any) => {
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
                    dni: empleado.dni,
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
                    dni: empleado.dni,
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
    const db = Database.Instance();

}

export const deleteTpvResolver = async (root: any, args: any, context: any) => {
    const db = Database.Instance();
}

export const updateTpvResolver = async (root: any, args: any, context: any) => {
    const db = Database.Instance();

    // No se puede actualizar si la tpv está ocupada

}

export const transferirTpvResolver = async (root: any, args: { idEmpleadoDestinatario: string, idTPV: string }, context: any):
    Promise<{ message: string, successful: boolean, token: string | null }> => {
    const db = Database.Instance();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw "No se ha encontrado la clave privada del JWT"
    }

    // Comprobar TPV
    const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV });
    if (!tpv) { return { message: "TPV no encontrada", token: null, successful: false } }
    if (tpv.libre) return { message: "No se puede transferir una TPV que no está en uso", token: null, successful: false }

    // Comprobar empleado remitente
    const empleadoRemitente = await db.EmployeeDBController.CollectionModel.findOne({ _id: tpv.enUsoPor._id })
    if (!empleadoRemitente) { return { message: "Empleado remitente no encontrado", token: null, successful: false } }

    // Comprobar empleado destinatario
    const empleadoDestinatario = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleadoDestinatario })
    if (!empleadoDestinatario) { return { message: "Empleado destinatario no encontrado", token: null, successful: false } }

    // Comprobar que el empleado al que se le va a transferir el control 
    // de la TPV no esté usando otra en ese momento. 
    const tpvs = await db.TPVDBController.CollectionModel.find({ libre: false })
    for (let index = 0; index < tpvs.length; index++) {
        const tpv = tpvs[index];

        if (tpv.enUsoPor._id === args.idEmpleadoDestinatario) {
            return { message: "El empleado destinatario está usando otra TPV", successful: false, token: null }
        }
    }

    const empleado = {
        _id: empleadoDestinatario._id,
        nombre: empleadoDestinatario.nombre,
        apellidos: empleadoDestinatario.apellidos,
        rol: empleadoDestinatario.rol,
        email: empleadoDestinatario.email,
        dni: empleadoDestinatario.dni,
    } as IEmployee;
    const res = await db.TPVDBController.CollectionModel.updateOne({ _id: args.idTPV }, { enUsoPor: empleado });

    if (res.modifiedCount <= 0) { return { message: "No se ha podido transferir la TPV", successful: false, token: null } }

    const payload: JWTPayload = { _id: empleadoRemitente._id, nombre: empleadoRemitente.nombre, apellidos: empleadoRemitente.apellidos, email: empleadoRemitente.email, rol: empleadoRemitente.rol };
    const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
    const token = jwt.sign(payload, secret, {
        expiresIn: 3600 * Number(jwtHoursDuration)
    });

    return { message: "TPV transferida correctamente", successful: true, token: `Bearer ${token}` }
}

export const ocupyTpvResolver = async (root: any, args: { idEmpleado: string, idTPV: string, cajaInicial: number }, context: any) => {
    const db = Database.Instance();

    // Secret Key
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw "No se ha encontrado la clave privada del JWT"
    }

    // Comprobar que el empleado existe
    const empleado = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.idEmpleado });
    if (!empleado) { return { token: null, successful: false } }

    // Comprobar que el empleado no está ocupando ya una TPV
    const tpvEnUsoPorEmpleado = await db.TPVDBController.CollectionModel.findOne({ libre: false, "enUsoPor._id": args.idEmpleado })
    if (tpvEnUsoPorEmpleado) { return { token: null, successful: false } }

    // Comprobar que la TPV que se quiere ocupar existe y está libre
    const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.idTPV });
    if (!tpv) { return { token: null, successful: false } }
    if (!tpv.libre) return { token: null, successful: false }

    const empleadoClean = {
        _id: empleado._id,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        rol: empleado.rol,
        email: empleado.email,
        dni: empleado.dni,
    } as IEmployee;

    const tpvUpdate: UpdateQuery<ITPV & {
        _id: Types.ObjectId;
    }> = {
        libre: false,
        abiertoPor: empleadoClean,
        enUsoPor: empleadoClean,
        cajaInicial: args.cajaInicial,
        fechaApertura: String(Date.now()),
    }
    await tpv.updateOne(tpvUpdate);

    //Login JWT payload
    const payload: JWTPayload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol, TPV: tpv._id };
    const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;

    // Create Token Expires in 1 hour
    const token = jwt.sign(payload, secret, {
        expiresIn: 3600 * Number(jwtHoursDuration)
    });

    // Finally return user token
    return {
        token: `Bearer ${token}`,
        successful: true
    };
}

export const freeTpvResolver = async (root: any, args: { idEmpleado: string, idTPV: string }, context: any) => {
    const db = Database.Instance();

    // Secret Key
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw "No se ha encontrado la clave privada del JWT"
    }

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
        dni: empleado.dni
    } as IEmployee;
    await tpv.updateOne({ libre: true, enUsoPor: empleadoClean });

    //Login JWT payload
    const payload: JWTPayload = { _id: empleado._id, nombre: empleado.nombre, apellidos: empleado.apellidos, email: empleado.email, rol: empleado.rol };
    const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;

    // Create Token Expires in 1 hour
    const token = jwt.sign(payload, secret, {
        expiresIn: 3600 * Number(jwtHoursDuration)
    });

    // Finally return user token
    return {
        token: `Bearer ${token} `,
        successful: true
    };
}

