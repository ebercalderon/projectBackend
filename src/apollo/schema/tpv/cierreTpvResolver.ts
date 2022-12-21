import { UserInputError } from "apollo-server-express";
import { Database } from "../../../databases/database";
import jwt from "jsonwebtoken";
import { CierreTPVInput, CierreTPVUpdateInput, JWTPayload } from "../../../types/types";
import { ICierreTPV } from "../../../types/TPV";
import mongoose from "mongoose";

export const cierreTpvResolver = async (parent: any, args: any, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if (!args.find.nombre && !args.find._id) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');

    const db = Database.Instance();

    if (args.find.nombre) {
        return await db.TPVDBController.CollectionModel.findOne({ nombre: args.find.nombre }).exec();
    }

    return await db.TPVDBController.CollectionModel.findOne({ _id: args.find._id }).exec();
}

export const cierreTpvsResolver = async (parent: any, args: any, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const db = Database.Instance();

        if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
            const cierres = await db.CierreTPVDBController.CollectionModel.find({})
                .sort({ apertura: -1 })
                .limit(args.limit || 200)
                .exec();

            return cierres
        }

        if (args.find.apertura) {
            const apertura = new Date(args.find.apertura);
            const cierres = await db.CierreTPVDBController.CollectionModel.find({ apertura: apertura })
                .sort({ apertura: -1 })
                .limit(args.limit || 200)
                .exec();

            return cierres
        }

        if (args.find.query) {
            const isQueryValidId = mongoose.Types.ObjectId.isValid(args.find.query);
            let tpv;
            if (isQueryValidId) {
                const cierre = await db.CierreTPVDBController.CollectionModel.findById(args.find.query)
                if (cierre !== null) {
                    return [cierre]
                }

                tpv = await db.TPVDBController.CollectionModel.findById(args.find.query);
            }

            if (args.find.fechaInicial && args.find.fechaFinal) {
                const fechaInicial = new Date(args.find.fechaInicial);
                const fechaFinal = new Date(args.find.fechaFinal);

                let filtro;
                if (tpv) {
                    filtro = {
                        tpv: tpv._id,
                        cierre: {
                            $gte: fechaInicial,
                            $lt: fechaFinal
                        }
                    }
                }
                else {
                    filtro = {
                        $or: [
                            { "abiertoPor.nombre": args.find.query },
                            { "abiertoPor.email": args.find.query },
                            { "cerradoPor.nombre": args.find.query },
                            { "cerradoPor.email": args.find.query }
                        ],
                        cierre: {
                            $gte: fechaInicial,
                            $lt: fechaFinal
                        }
                    }
                }

                const cierres = await db.CierreTPVDBController.CollectionModel.find(filtro)
                    .sort({ apertura: -1 })
                    .limit(args.limit || 200)
                    .exec();

                return cierres
            }
            else {
                let filtro;
                if (tpv) {
                    filtro = {
                        tpv: tpv._id
                    }
                }
                else {
                    filtro = {
                        $or: [
                            { "abiertoPor.nombre": args.find.query },
                            { "abiertoPor.email": args.find.query },
                            { "cerradoPor.nombre": args.find.query },
                            { "cerradoPor.email": args.find.query }
                        ]
                    }
                }
                const cierres = await db.CierreTPVDBController.CollectionModel.find(filtro)
                    .sort({ apertura: -1 })
                    .limit(args.limit || 200)
                    .exec();

                return cierres
            }
        }

        if (args.find.fechaInicial && args.find.fechaFinal) {
            const fechaInicial = new Date(args.find.fechaInicial);
            const fechaFinal = new Date(args.find.fechaFinal);

            const cierres = await db.CierreTPVDBController.CollectionModel.find({
                cierre: {
                    $gte: fechaInicial,
                    $lt: fechaFinal
                }
            })
                .sort({ apertura: -1 })
                .limit(args.limit || 200)
                .exec();

            return cierres
        }

        return []
    }
    catch (err) {
        return []
    }

}

export const addCierreTpvResolver = async (root: any, args: { cierre: CierreTPVInput }, context: any) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return {
                message: "Error en servidor: clave privada JWT no encontrada",
                successful: false,
                token: null,
                cierre: null
            }
        }

        const db = Database.Instance();

        const empleadoCerrando = await db.EmployeeDBController.CollectionModel.findById(args.cierre.empleadoCerrandoId);
        if (!empleadoCerrando) {
            return {
                message: "Empleado no ecnontrado en el sistema",
                successful: false,
                token: null,
                cierre: null
            }
        }

        const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.cierre.tpv, libre: false, "enUsoPor._id": empleadoCerrando._id }).exec();
        if (!tpv) {
            return {
                message: "Este empleado no está usando esta TPV en este momento",
                successful: false,
                token: null,
                cierre: null
            }
        }

        const fechaApertura = new Date().setTime(Number(tpv.fechaApertura));
        const fechaActual = Date.now();
        const ventas = await db.VentasDBController.CollectionModel.find({ "createdAt": { $gte: fechaApertura, $lte: fechaActual } }).exec();

        const res = await db.CierreTPVDBController.CollectionModel.create({
            tpv: args.cierre.tpv,
            abiertoPor: tpv.abiertoPor,
            cerradoPor: empleadoCerrando,
            apertura: fechaApertura,
            cierre: fechaActual,
            cajaInicial: tpv.cajaInicial,
            numVentas: ventas.length,
            dineroEsperadoEnCaja: args.cierre.dineroEsperadoEnCaja,
            dineroRealEnCaja: args.cierre.dineroRealEnCaja,
            ventasEfectivo: args.cierre.ventasEfectivo,
            ventasTarjeta: args.cierre.ventasTarjeta,
            ventasTotales: args.cierre.ventasTotales,
            dineroRetirado: args.cierre.dineroRetirado,
            fondoDeCaja: args.cierre.dineroRealEnCaja - args.cierre.dineroRetirado,
            nota: args.cierre.nota || ""
        } as unknown as ICierreTPV);

        if (res.errors) {
            return {
                message: "No se ha podido añadir el cierre de caja",
                successful: false,
                token: null,
                cierre: null
            }
        }

        const payload: JWTPayload = { _id: empleadoCerrando._id, nombre: empleadoCerrando.nombre, apellidos: empleadoCerrando.apellidos, email: empleadoCerrando.email, rol: empleadoCerrando.rol };
        const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
        const token = jwt.sign(payload, secret, {
            expiresIn: 3600 * Number(jwtHoursDuration)
        });

        const tpvUpdated = await db.TPVDBController.CollectionModel.updateOne({ _id: tpv._id }, { libre: true, abiertoPor: null, enUsoPor: null, fechaApertura: null });
        if (tpvUpdated.modifiedCount <= 0) {
            return {
                message: "No se ha podido liberar la TPV",
                successful: false,
                token: `Bearer ${token}`,
                cierre: res
            }
        }

        return {
            message: "Cierre añadido correctamente",
            successful: true,
            token: `Bearer ${token}`,
            cierre: res
        }
    }
    catch (err) {
        return {
            message: err,
            successful: false,
            token: null,
            cierre: null
        }
    }

}

export const deleteCierreTpvResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    const db = Database.Instance();

    const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de cierre inválido", successful: false }
    }

    const deletedProd = await db.CierreTPVDBController.CollectionModel.deleteOne({ _id: args._id });

    if (deletedProd.deletedCount > 0) {
        return { message: "Cierre eliminado correctamente", successful: true }
    }

    return { message: "No se ha podido eliminar el cierre", successful: false }
}

export const updateCierreTpvResolver = async (root: any, args: { cierre: CierreTPVUpdateInput }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

}
