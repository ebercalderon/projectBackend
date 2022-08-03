import mongoose, { SortOrder } from 'mongoose';
import { UserInputError } from "apollo-server-express";
import { Database } from "../../../databases/database"
import { DevolucionFind, VentaFind } from "../../../types/types";
import { ISale } from "../../../types/Venta";
import { IDevolucion } from '../../../types/Devolucion';
import { IReturnProduct, ISoldProduct } from '../../../types/Producto';

export const devolucionResolver = async (parent: any, args: VentaFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if (args === null || !args || Object.keys(args).length === 0 && args.constructor === Object) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');

    const db = Database.Instance();

    if (args._id) {
        const venta = await db.DevolucionDBController.CollectionModel.findOne({ _id: args._id }).exec();

        if (venta) return venta;
    }

    return null;
}

export const devolucionesResolver = async (parent: any, args: DevolucionFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Comprueba si find es null, undefined o vacío
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({}).sort({ createdAt: order }).limit(args.limit || 500).skip(args.offset || 0).exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.createdAt && args.find.tpv) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({ tpv: args.find.tpv, "createdAt": { $gte: parseInt(args.find.createdAt), $lt: Date.now() } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?._ids) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({ _id: args.find._ids })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.clienteId) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({ $cliente: { _id: args.find.clienteId } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.vendedorId) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({ $trabajador: { _id: args.find.vendedorId } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.createdAt) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({ createdAt: args.find.createdAt })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.tpv) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find({ tpv: args.find.tpv })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.fechaInicial && args.find?.fechaFinal) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const devoluciones = await db.DevolucionDBController.CollectionModel.find(
            {
                "createdAt":
                {
                    $gte: new Date(Number(args.find.fechaInicial)),
                    $lt: new Date(Number(args.find.fechaFinal))
                }
            })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (devoluciones) return devoluciones;
    }

    if (args.find?.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose.Types.ObjectId.isValid(query);

        let devoluciones = [];
        if (isQueryValidId) {
            devoluciones = await db.DevolucionDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();

            return devoluciones;
        }

        let queryConFecha: mongoose.FilterQuery<ISale>[] = [{}]
        let limite = args.limit || 150;

        if (args.find.fechaInicial && args.find.fechaFinal) {
            queryConFecha = [{
                "createdAt":
                {
                    $gte: new Date(Number(args.find.fechaInicial)),
                    $lt: new Date(Number(args.find.fechaFinal))
                }
            }];

            limite = 1000
        }

        const tpv = await db.TPVDBController.CollectionModel.findOne({ nombre: { "$regex": query, "$options": "i" } });
        if (tpv) {
            const r = await db.DevolucionDBController.CollectionModel.find({
                tpv: tpv._id,
                "createdAt":
                {
                    $gte: new Date(Number(args.find.fechaInicial)),
                    $lt: new Date(Number(args.find.fechaFinal))
                }
            })
                .limit(args.limit || 150)
                .exec();

            return [...r]
        }

        devoluciones = await db.DevolucionDBController.CollectionModel.find({
            $or: [
                { "productos.nombre": { "$regex": query, "$options": "i" } },
                { "productos.ean": { "$regex": query, "$options": "i" } },
                { "productos.proveedor": { "$regex": query, "$options": "i" } },
                { "productos.familia": { "$regex": query, "$options": "i" } },
                { "trabajador.nombre": { "$regex": query, "$options": "i" } },
                { "trabajador.email": { "$regex": query, "$options": "i" } },
                { "trabajador.dni": { "$regex": query, "$options": "i" } },
                { "trabajador.rol": { "$regex": query, "$options": "i" } },
                { "modificadoPor.nombre": { "$regex": query, "$options": "i" } },
                { "modificadoPor.email": { "$regex": query, "$options": "i" } },
                { "modificadoPor.dni": { "$regex": query, "$options": "i" } },
                { "modificadoPor.rol": { "$regex": query, "$options": "i" } },
                { "cliente.nombre": { "$regex": query, "$options": "i" } },
                { "cliente.nif": { "$regex": query, "$options": "i" } }
            ],
            $and: queryConFecha,
        })
            .limit(limite)
            .sort({ "createdAt": -1 })
            .exec();

        return devoluciones;
    }

    return [];
}

export const addDevolucionResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const db = Database.Instance();

        const ventaOriginal = await db.VentasDBController.CollectionModel.findOne({ "_id": args.fields.ventaId }).exec();
        if (!ventaOriginal) { return { message: "La venta original no está en la BBDD", successful: false } }

        const productosDevueltos: IReturnProduct[] = args.fields.productosDevueltos;
        const dineroDevuelto = productosDevueltos.reduce((prev, prod) => {
            let precio = prod.precioFinal ? prod.precioFinal : prod.precioVenta * ((100 - prod.dto) / 100)
            return prev + (precio * prod.cantidadDevuelta)
        }, 0)

        const trabajador = await db.EmployeeDBController.CollectionModel.findOne({ "_id": args.fields.trabajadorId });
        const devolucionToAdd = new db.DevolucionDBController.CollectionModel({
            productosDevueltos: args.fields.productosDevueltos,
            dineroDevuelto: dineroDevuelto,
            cliente: ventaOriginal.cliente,
            trabajador: trabajador,
            modificadoPor: trabajador,
            tpv: args.fields.tpv,
            ventaOriginal: ventaOriginal
        } as IDevolucion);

        // Añadir nueva devolucion
        const res: any = await devolucionToAdd.save();

        await ActualizarStock(db, args.fields);
        await ActualizarVenta(db, args.fields, ventaOriginal);

        // Comprueba si se ha añadido correctamente la venta a la base de datos
        if (res.errors) {
            return { message: "No se ha podido añadir la devolución a la base de datos", successful: false }
        }

        return { message: "Devolución añadida con éxito", successful: true, _id: res._id, createdAt: res.createdAt }
    }
    catch (err) {
        return { message: err, successful: false }
    }
}

export const deleteDevolucionResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();
}

export const updateDevolucionResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

}

const ActualizarStock = async (db: Database, fields: any) => {
    fields.productosDevueltos.forEach(async (p: IReturnProduct) => {
        await db.ProductDBController.CollectionModel.findOneAndUpdate({ _id: p._id }, { "$inc": { "cantidad": +p.cantidadDevuelta } });
    });
}

const ActualizarVenta = async (db: Database, fields: any, ventaOriginal: ISale) => {
    const prodMap: Map<string, number> = new Map();
    const updatedProductList: ISoldProduct[] = []
    let numProdEnVenta = 0;
    let numProdDevuelto = 0;

    // Actualizar la cantidad de productos de la venta original
    fields.productosDevueltos.forEach(async (p: IReturnProduct) => {
        prodMap.set(p._id, p.cantidadDevuelta)
        numProdDevuelto += p.cantidadDevuelta
    });

    ventaOriginal.productos.forEach((prod) => {
        let p = prod;
        const cantidadDevuelta = prodMap.get(String(p._id))

        numProdEnVenta += prod.cantidadVendida

        if (cantidadDevuelta && cantidadDevuelta > 0) {
            p.cantidadVendida -= cantidadDevuelta
            if (p.cantidadVendida > 0) {
                updatedProductList.push(p)
            }
        }
        else {
            updatedProductList.push(p)
        }
    })

    if (numProdEnVenta === numProdDevuelto) {
        await db.VentasDBController.CollectionModel.deleteOne({ "_id": fields.ventaId })
    }
    else {
        let precioVentaTotalSinDto = 0;
        let precioVentaTotal = 0;

        updatedProductList.forEach((p) => {
            precioVentaTotalSinDto += p.precioVenta * p.cantidadVendida

            if (p.precioFinal !== undefined) {
                precioVentaTotal += p.precioFinal * p.cantidadVendida
            }
            else {
                precioVentaTotal += (p.precioVenta * p.cantidadVendida * ((100 - p.dto) / 100))
            }
        })

        let cambio = ventaOriginal.cambio || 0;
        let updatedVenta = {
            productos: updatedProductList,
            dineroEntregadoEfectivo: ventaOriginal.dineroEntregadoEfectivo,
            dineroEntregadoTarjeta: ventaOriginal.dineroEntregadoTarjeta,
            precioVentaTotalSinDto: Number(precioVentaTotalSinDto.toFixed(2)),
            precioVentaTotal: Number(precioVentaTotal.toFixed(2)),
            cambio: Number((cambio + (ventaOriginal.precioVentaTotal - precioVentaTotal)).toFixed(2))
        }

        const vUpdated = await db.VentasDBController.CollectionModel.updateOne({ "_id": fields.ventaId }, updatedVenta)
    }
}