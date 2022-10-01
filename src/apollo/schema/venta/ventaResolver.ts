import mongoose, { SortOrder } from 'mongoose';
import { UserInputError } from "apollo-server-express";
import { Database } from "../../../databases/database"
import { VentaFind, VentasFind } from "../../../types/types";
import { ISale } from "../../../types/Venta";
import { ISoldProduct } from '../../../types/Producto';

export const ventaResolver = async (parent: any, args: VentaFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if (args === null || !args || Object.keys(args).length === 0 && args.constructor === Object) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');

    const db = Database.Instance();

    if (args._id) {
        const venta = await db.VentasDBController.CollectionModel.findOne({ _id: args._id }).exec();

        if (venta) return venta;
    }

    return null;
}

export const ventasResolver = async (parent: any, args: VentasFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Comprueba si find es null, undefined o vacío
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const ventas = await db.VentasDBController.CollectionModel.find({}).sort({ createdAt: "desc" }).limit(args.limit || 500).skip(args.offset || 0).exec();

        if (ventas) return ventas;
    }

    if (args.find?.createdAt && args.find.tpv) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ tpv: args.find.tpv, "createdAt": { $gte: parseInt(args.find.createdAt), $lt: Date.now() } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?._ids) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ _id: args.find._ids })
            .sort({ createdAt: order || "desc" })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.clienteId) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ $cliente: { _id: args.find.clienteId } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.tipo) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ tipo: args.find.tipo })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.vendedorId) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ $vendidoPor: { _id: args.find.vendedorId } })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.createdAt) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ createdAt: args.find.createdAt })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.tpv) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find({ tpv: args.find.tpv })
            .sort({ createdAt: order })
            .limit(args.limit || 500)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.fechaInicial && args.find?.fechaFinal && !args.find.query) {
        let order: SortOrder = "desc";
        if (args.order) { order = args.order as mongoose.SortOrder }
        const ventas = await db.VentasDBController.CollectionModel.find(
            {
                "createdAt":
                {
                    $gte: new Date(Number(args.find.fechaInicial)),
                    $lt: new Date(Number(args.find.fechaFinal))
                }
            })
            .sort({ createdAt: order })
            .limit(args.limit || 25000)
            .skip(args.offset || 0)
            .exec();

        if (ventas) return ventas;
    }

    if (args.find?.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose.Types.ObjectId.isValid(query);

        let ventas = [];
        if (isQueryValidId) {
            ventas = await db.VentasDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();

            return ventas;
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

            limite = 25000
        }

        const tpv = await db.TPVDBController.CollectionModel.findOne({ nombre: { "$regex": query, "$options": "i" } });
        if (tpv) {
            const r = await db.VentasDBController.CollectionModel.find({
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

        ventas = await db.VentasDBController.CollectionModel.find({
            $or: [
                { "productos.nombre": { "$regex": query, "$options": "i" } },
                { "productos.ean": { "$regex": query, "$options": "i" } },
                { "productos.proveedor": { "$regex": query, "$options": "i" } },
                { "productos.familia": { "$regex": query, "$options": "i" } },
                { "vendidoPor.nombre": { "$regex": query, "$options": "i" } },
                { "vendidoPor.email": { "$regex": query, "$options": "i" } },
                { "vendidoPor.dni": { "$regex": query, "$options": "i" } },
                { "vendidoPor.rol": { "$regex": query, "$options": "i" } },
                { "modificadoPor.nombre": { "$regex": query, "$options": "i" } },
                { "modificadoPor.email": { "$regex": query, "$options": "i" } },
                { "modificadoPor.dni": { "$regex": query, "$options": "i" } },
                { "modificadoPor.rol": { "$regex": query, "$options": "i" } },
                { "tipo": { "$regex": query, "$options": "i" } },
                { "cliente.nombre": { "$regex": query, "$options": "i" } },
                { "cliente.nif": { "$regex": query, "$options": "i" } }
            ],
            $and: queryConFecha,
        })
            .limit(limite)
            .sort({ "createdAt": -1 })
            .exec();

        return ventas;
    }

    return [];
}

export const addVentaResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    try {
        const db = Database.Instance();
        const ventaFixed = await FixVentaConsistency(args.fields);
        const saleToAdd: mongoose.Document<ISale> = new db.VentasDBController.CollectionModel(ventaFixed);
        const res: any = await saleToAdd.save();

        let isUpdatingCorrectly = true;
        // Actualizar la cantidad de productos
        args.fields.productos.forEach(async (p: ISoldProduct) => {
            const err = await db.ProductDBController.CollectionModel.findOneAndUpdate({ _id: p._id }, { "$inc": { "cantidad": -p.cantidadVendida } });
            if (err?.errors && isUpdatingCorrectly) {
                isUpdatingCorrectly = false;
            }
        });

        // Comprueba si se ha añadido correctamente la venta a la base de datos
        if (res.errors) {
            return { message: "No se ha podido añadir la venta a la base de datos", successful: false }
        }

        // Comprueba si se han actualizado correctamente las cantidades de los productos
        if (!isUpdatingCorrectly) {
            return { message: "Venta añadida pero las cantidades no han sido actualizadas correctamente", successful: true }
        }

        return { message: "Venta añadida con éxito", successful: true, _id: res._id, createdAt: res.createdAt }
    }
    catch (err) {
        return { message: err, successful: false }
    }
}

export const deleteVentaResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();
}

export const updateVentaResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de venta inválido", successful: false }
    }

    const db = Database.Instance();
    const ventaOriginal = await db.VentasDBController.CollectionModel.findOne({ _id: args._id })
    if (!ventaOriginal) {
        return { message: "La venta original no existe", successful: false }
    }

    const venta = {
        productos: ventaOriginal.productos,
        dineroEntregadoEfectivo: ventaOriginal.dineroEntregadoEfectivo,
        dineroEntregadoTarjeta: ventaOriginal.dineroEntregadoTarjeta,
        precioVentaTotalSinDto: ventaOriginal.precioVentaTotalSinDto,
        precioVentaTotal: args.precioVentaTotal,
        cambio: ventaOriginal.cambio,
        cliente: args.cliente,
        vendidoPor: ventaOriginal.vendidoPor,
        modificadoPor: args.modificadoPor,
        tipo: args.tipo,
        descuentoEfectivo: ventaOriginal.descuentoEfectivo,
        descuentoPorcentaje: ventaOriginal.descuentoPorcentaje,
        tpv: ventaOriginal.tpv,
    } as unknown as ISale;

    const resultadoUpdate = await db.VentasDBController.CollectionModel.updateOne({ _id: args._id }, { $set: venta });
    const updatedSale: any = await db.VentasDBController.CollectionModel.findOne({ _id: args._id });
    if (resultadoUpdate.modifiedCount > 0) {
        return { _id: args._id, message: "Venta actualizada correctamente", successful: true, createdAt: updatedSale?.createdAt }
    }

    return { message: "No se ha podido actualizar la venta", successful: false }
}

const FixVentaConsistency = async (venta: any): Promise<ISale> => {
    const db = Database.Instance();
    const numVentas = await db.VentasDBController.CollectionModel.countDocuments();
    const currentYear = new Date().getFullYear()
    const nFactura = `${currentYear}/${numVentas + 1}`

    try {
        const [productosVendidosFixed, precioVentaTotal, precioVentaTotalSinDto] = FixProductInconsistency(venta.productos)

        if (productosVendidosFixed.length <= 0 || venta.productos.length != productosVendidosFixed.length) {
            return CreateUncheckedSale(venta, nFactura)
        }

        const cambio = (venta.dineroEntregadoEfectivo + venta.dineroEntregadoTarjeta) - precioVentaTotal;
        const ventaFixed = {
            productos: productosVendidosFixed,
            numFactura: nFactura,
            dineroEntregadoEfectivo: venta.dineroEntregadoEfectivo,
            dineroEntregadoTarjeta: venta.dineroEntregadoTarjeta,
            precioVentaTotalSinDto: precioVentaTotalSinDto,
            precioVentaTotal: precioVentaTotal,
            cambio: cambio > 0 ? Number(cambio.toFixed(2)) : 0,
            cliente: venta.cliente,
            vendidoPor: venta.vendidoPor,
            modificadoPor: venta.modificadoPor,
            tipo: venta.tipo,
            descuentoEfectivo: venta.descuentoEfectivo,
            descuentoPorcentaje: venta.descuentoPorcentaje,
            tpv: venta.tpv
        } as ISale

        return ventaFixed;
    }
    catch (err) {
        return CreateUncheckedSale(venta, nFactura)
    }
}

const FixProductInconsistency = (productos: ISoldProduct[]): [ISoldProduct[], number, number] => {
    try {
        let productosFixed: ISoldProduct[] = []
        let precioVentaTotal = 0
        let precioVentaTotalSinDto = 0

        for (let index = 0; index < productos.length; index++) {
            let producto: ISoldProduct = productos[index];
            try {
                if (!producto.familia) { producto.familia = "" }
                if (!producto.precioCompra) {
                    const iva = producto.iva || 10
                    const margen = producto.margen || 20
                    producto.precioCompra = producto.precioVenta / (1 + ((iva + margen) / 100))
                    producto.precioCompra = Number(producto.precioCompra.toFixed(2))
                }
                if (producto.margen <= 0 || !producto.margen) {
                    const iva = producto.iva || 10
                    const precioConIva = producto.precioCompra + (producto.precioCompra * (iva / 100))
                    producto.margen = 1 - ((producto.precioFinal / precioConIva) * 100)
                    producto.margen = Number(producto.margen.toFixed(2))
                }
                if (producto.precioFinal > producto.precioVenta) {
                    producto.precioFinal = producto.precioVenta * (1 - (producto.dto / 100))
                    producto.precioFinal = Number(producto.precioFinal.toFixed(2))
                }
                if (producto.precioFinal === producto.precioVenta) { producto.dto = 0 }
            }
            catch (err) { }
            finally {
                productosFixed.push(producto)
                precioVentaTotal += producto.precioFinal * producto.cantidadVendida
                precioVentaTotalSinDto += producto.precioVenta * producto.cantidadVendida
            }
        }

        return [productosFixed, Number(precioVentaTotal.toFixed(2)), Number(precioVentaTotalSinDto.toFixed(2))];
    }
    catch (err) {
        return [[], -1, -1]
    }
}

const CreateUncheckedSale = (venta: any, numFactura: string): ISale => {
    return {
        productos: venta.productos,
        numFactura: numFactura,
        dineroEntregadoEfectivo: venta.dineroEntregadoEfectivo,
        dineroEntregadoTarjeta: venta.dineroEntregadoTarjeta,
        precioVentaTotalSinDto: venta.precioVentaTotalSinDto,
        precioVentaTotal: venta.precioVentaTotal,
        cambio: venta.cambio,
        cliente: venta.cliente,
        vendidoPor: venta.vendidoPor,
        modificadoPor: venta.modificadoPor,
        tipo: venta.tipo,
        descuentoEfectivo: venta.descuentoEfectivo,
        descuentoPorcentaje: venta.descuentoPorcentaje,
        tpv: venta.tpv
    } as ISale
}