import { UserInputError } from "apollo-server-express";
import { Database } from "../../../databases/database";
import jwt from "jsonwebtoken";
import { CierreTPVInput } from "../../../types/types";
import { ICierreTPV } from "../../../types/TPV";
import { ISale } from "../../../types/Venta";
import { ISoldProduct } from "../../../types/Producto";
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
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return {
                message: "Error en servidor: clave privada JWT no encontrada",
                successful: false,
                token: ""
            }
        }

        const db = Database.Instance();

        const payload = { _id: args.cierre.abiertoPor._id, nombre: args.cierre.abiertoPor.nombre, apellidos: args.cierre.abiertoPor.apellidos, email: args.cierre.abiertoPor.email, rol: args.cierre.abiertoPor.rol };
        const jwtHoursDuration = process.env.JWT_HOURS_DURATION || 1;
        const token = jwt.sign(payload, secret, {
            expiresIn: 3600 * Number(jwtHoursDuration)
        });

        const tpv = await db.TPVDBController.CollectionModel.findOne({ _id: args.cierre.tpv, libre: false }).exec();
        if (!tpv) {
            return {
                message: "Este empleado no está usando esta TPV en este momento",
                successful: false,
                token: `Bearer ${token}`
            }
        }

        const fechaApertura = new Date().setTime(Number(args.cierre.apertura));
        const fechaActual = Date.now();

        const ventas = await db.VentasDBController.CollectionModel.find({ "createdAt": { $gte: fechaApertura, $lt: fechaActual } }).exec();
        const productosVendidos: ISoldProduct[] = ventas.map(v => v.productos).flat();

        let beneficio = productosVendidos.reduce((total: number, p: ISoldProduct): number => {
            return total += (p.precioCompra - p.precioFinal) * p.cantidadVendida;
        }, 0);

        const res = await db.CierreTPVDBController.CollectionModel.create({
            tpv: args.cierre.tpv,
            abiertoPor: args.cierre.abiertoPor,
            cerradoPor: args.cierre.cerradoPor,
            apertura: fechaApertura,
            cierre: fechaActual,
            cajaInicial: args.cierre.cajaInicial,
            numVentas: args.cierre.numVentas,
            dineroEsperadoEnCaja: args.cierre.dineroEsperadoEnCaja,
            dineroRealEnCaja: args.cierre.dineroRealEnCaja,
            ventasEfectivo: args.cierre.ventasEfectivo,
            ventasTarjeta: args.cierre.ventasTarjeta,
            ventasTotales: args.cierre.ventasTotales,
            dineroRetirado: args.cierre.dineroRetirado,
            fondoDeCaja: args.cierre.fondoDeCaja,
            beneficio: beneficio,
            nota: args.cierre.nota || ""
        } as unknown as ICierreTPV);

        if (res.errors) {
            return {
                message: "No se ha podido añadir el cierre de caja",
                successful: false,
                token: token,
                cierre: null
            }
        }

        const tpvUpdated = await db.TPVDBController.CollectionModel.updateOne({ _id: tpv._id }, { libre: true });

        if (tpvUpdated.modifiedCount <= 0) {
            return {
                message: "No se ha podido liberar la TPV",
                successful: false,
                token: `Bearer ${token}`,
                cierre: res
            }
        }

        return {
            message: "Cierre añadido correctamenete",
            successful: true,
            token: `Bearer ${token}`,
            cierre: res
        }
    }
    catch (err) {
        return {
            message: err,
            successful: false,
            token: "",
            cierre: null
        }
    }

}

export const deleteCierreTpvResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();
}

export const updateCierreTpvResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

}
