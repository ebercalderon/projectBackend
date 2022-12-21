import { UserInputError } from "apollo-server-express";
import mongoose, { SortOrder } from "mongoose";
import { Database } from "../../../databases/database"
import { IMerma } from "../../../types/Merma";
import { IProduct, IProductoMermado } from "../../../types/Producto";
import { MermaFind, MermaInput, MermasFind, NuevoProductoMermado } from "../../../types/types";

export const mermaResolver = async (parent: any, args: MermaFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if (!args.find._id) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');

    const db = Database.Instance();

    if (args.find._id) {
        const merma = await db.MermaDBController.CollectionModel.findOne({ _id: args.find._id }).exec();

        if (merma) return merma;
    }
    return null;
}

export const mermasResolver = async (parent: any, args: MermasFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();
    let order: SortOrder = "desc";

    if (args.find?.query) {
        const isQueryValidId = mongoose.Types.ObjectId.isValid(args.find.query);
        if (isQueryValidId) {
            const mermas = await db.MermaDBController.CollectionModel.find({ _id: args.find.query })
                .limit(args.limit || 150)
                .exec();

            return mermas;
        }

        const mermas = await db.MermaDBController.CollectionModel.find({
            $or: [
                { "productos.nombre": { "$regex": args.find.query, "$options": "i" } },
                { "productos.ean": args.find.query },
                { "productos.proveedor": { "$regex": args.find.query, "$options": "i" } },
                { "productos.familia": { "$regex": args.find.query, "$options": "i" } },
                { "productos.motivo": { "$regex": args.find.query, "$options": "i" } },
                { "creadoPor.nombre": args.find.query },
                { "creadoPor.email": args.find.query },
                { "creadoPor.dni": args.find.query },
            ],
            $and: args.find.fechaInicial && args.find.fechaFinal ?
                [
                    {
                        "createdAt":
                        {
                            $gte: new Date(Number(args.find.fechaInicial)),
                            $lt: new Date(Number(args.find.fechaFinal))
                        }
                    }
                ]
                :
                [{}]
        })
            .sort(order)
            .limit(args.limit || 150)
            .exec();

        return mermas;
    }

    if (args.find?.fechaFinal && args.find?.fechaFinal) {
        const mermas = await db.MermaDBController.CollectionModel.find(
            {
                "createdAt":
                {
                    $gte: new Date(Number(args.find.fechaInicial)),
                    $lt: new Date(Number(args.find.fechaFinal))
                }
            })
            .sort({ createdAt: order })
            .limit(args.limit || 1000)
            .exec();

        if (mermas) return mermas;
    }

    return await db.MermaDBController.CollectionModel.find()
        .sort({ createdAt: order })
        .limit(args.limit || 150)
        .exec();
}

export const addMermaResolver = async (root: any, args: { merma: MermaInput }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const db = Database.Instance();
        const empleado = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.merma.empleadoId });

        if (!empleado) { return { message: "El empleado no existe en el sistema", successful: false } }

        const costes = await CalcularMermaValues(args.merma.productos);
        const productosMermados = await GetProductosMermados(args.merma.productos);
        const merma: IMerma = {
            productos: productosMermados,
            creadoPor: empleado,
            costeProductos: Number(costes.costeProductos.toFixed(2)),
            ventasPerdidas: Number(costes.ventas.toFixed(2)),
            beneficioPerdido: Number(costes.beneficio.toFixed(2))
        } as unknown as IMerma

        const newMerma: mongoose.Document<IMerma> = new db.MermaDBController.CollectionModel(merma);
        const mermaGuardada = await newMerma.save();

        if (mermaGuardada !== newMerma) {
            return { message: "No se ha podido añadir la merma", successful: false }
        }

        const cantidadActualizada = await ActualizarCantidadProductos(merma);
        if (!cantidadActualizada) {
            return { message: "Merma creada pero no se ha podido actualizar las cantidades", successful: true }
        }

        return { message: "Merma añadida correctamente", successful: true, }
    }
    catch (err) {
        return { message: err, successful: false }
    }
}

export const deleteMermaResolver = async (root: any, args: { _id: string }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
        if (!isQueryValidId) {
            return { message: "ID de merma inválido", successful: false }
        }

        return await DeleteMerma(args._id);

    } catch (err) {
        return { message: err, successful: false }
    }
}

export const updateMermaResolver = async (root: any, args: { _id: string, merma: MermaInput }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    try {
        const db = Database.Instance();
        const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
        if (!isQueryValidId) {
            return { message: "ID de merma inválido", successful: false }
        }

        const empleado = await db.EmployeeDBController.CollectionModel.findOne({ _id: args.merma.empleadoId });
        if (empleado === null) { return { message: "El empleado no existe en el sistema", successful: false } }

        const mermaVieja = await db.MermaDBController.CollectionModel.findOne({ _id: args._id });
        if (mermaVieja === null) { return { message: "No se puede actualizar una merma que no existe", successful: false } }

        CheckMermaConsistency(args.merma);

        // Borrar merma
        const { successful } = await DeleteMerma(args._id)
        if (!successful) { return { message: "No se ha podido actualizar la merma correctamente", successful: false } }

        // Añadir nueva merma
        const costes = await CalcularMermaValues(args.merma.productos);
        const productosMermados = await GetProductosMermados(args.merma.productos);
        const updatedMerma: IMerma = {
            _id: args._id,
            productos: productosMermados,
            creadoPor: empleado,
            costeProductos: Number(costes.costeProductos.toFixed(2)),
            ventasPerdidas: Number(costes.ventas.toFixed(2)),
            beneficioPerdido: Number(costes.beneficio.toFixed(2))
        } as unknown as IMerma

        const newMerma: mongoose.Document<IMerma> = new db.MermaDBController.CollectionModel(updatedMerma);
        const mermaGuardada = await newMerma.save();

        if (mermaGuardada !== newMerma) {
            return { message: "No se ha podido actualizar la merma", successful: false }
        }

        const cantidadActualizada = await ActualizarCantidadProductos(updatedMerma);
        if (!cantidadActualizada) {
            return { message: "Merma creada pero no se ha podido actualizar las cantidades", successful: true }
        }

        return { message: "Merma actualizada correctamente", successful: true }
    }
    catch (err) {
        return { message: err, successful: false }
    }
}

const CalcularMermaValues = async (productosMermados: NuevoProductoMermado[]): Promise<{ costeProductos: number, ventas: number, beneficio: number }> => {
    const db = Database.Instance();
    const prodMap = new Map<string, IProduct>();

    const cursor = db.ProductDBController.CollectionModel.find({}).cursor();
    await cursor.eachAsync((prod) => {
        prodMap.set(prod._id.valueOf(), prod);
    })

    let costes: { costeProductos: number, ventas: number, beneficio: number } = { costeProductos: 0, ventas: 0, beneficio: 0 }
    for (let index = 0; index < productosMermados.length; index++) {
        const prodMermado = productosMermados[index];
        if (prodMermado.cantidad <= 0) { throw "Una merma no puede tener una cantidad igual o inferior a cero" }

        const producto = prodMap.get(prodMermado._id);
        if (producto === null || producto === undefined) { throw "El producto añadido a la merma no existe en el sistema" }

        const precioCompraIva = producto.precioCompra + (producto.precioCompra * (producto.iva / 100))

        costes.costeProductos += producto.precioCompra * prodMermado.cantidad;
        costes.ventas += producto.precioVenta * prodMermado.cantidad;
        costes.beneficio += (producto.precioVenta - precioCompraIva) * prodMermado.cantidad;
    }

    return costes;
}

const GetProductosMermados = async (productosMermados: NuevoProductoMermado[]): Promise<IProductoMermado[]> => {
    const db = Database.Instance()
    const prodMap = new Map<string, IProduct>();

    const cursor = db.ProductDBController.CollectionModel.find({}).cursor();
    await cursor.eachAsync((prod) => {
        prodMap.set(prod._id.valueOf(), prod);
    })

    let resultado = []
    for (let index = 0; index < productosMermados.length; index++) {
        const productoMermado = productosMermados[index];
        const prod = prodMap.get(productoMermado._id);

        if (prod === null || prod === undefined) { throw "El producto añadido a la merma no existe en el sistema" }

        const pRes = {
            _id: prod._id,
            nombre: prod.nombre,
            proveedor: prod.proveedor,
            cantidad: productoMermado.cantidad,
            familia: prod.familia,
            margen: prod.margen,
            ean: prod.ean,
            iva: prod.iva,
            precioCompra: prod.precioCompra,
            precioVenta: prod.precioVenta,
            motivo: productoMermado.motivo,
        } as IProductoMermado

        resultado.push(pRes);
    }

    return resultado;
}

const DeleteMerma = async (_id: string): Promise<{ message: string, successful: boolean }> => {
    try {
        const db = Database.Instance();

        const merma = await db.MermaDBController.CollectionModel.findOne({ _id: _id });
        if (!merma) { return { message: "No se ha encontrado la merma que se quiere eliminar o modificar", successful: false } }

        const actualizadoCorrectamente = await ActualizarCantidadProductos(merma, true);
        if (!actualizadoCorrectamente) { return { message: "No se ha podido actualizar las cantidades", successful: false } }

        const deletedMerm = await db.MermaDBController.CollectionModel.deleteOne({ _id: _id });
        if (deletedMerm.deletedCount <= 0) {
            return { message: "No se ha podido eliminar la merma", successful: false }
        }

        return { message: "Merma eliminada correctamente", successful: true }
    }
    catch (err) {
        return { message: "Error al eliminar la merma: " + err, successful: false }
    }
}

const ActualizarCantidadProductos = async (merma: IMerma | IMerma & { _id: mongoose.Types.ObjectId }, isDeleting?: boolean): Promise<boolean> => {
    try {
        const db = Database.Instance();

        for (let index = 0; index < merma.productos.length; index++) {
            const productoMermado = merma.productos[index];
            const res = await db.ProductDBController.CollectionModel
                .updateOne({ _id: productoMermado._id },
                    { "$inc": { "cantidad": isDeleting ? productoMermado.cantidad : -productoMermado.cantidad } },
                    { timestamps: false })

            if (res.modifiedCount <= 0) { return false }
        }
        return true;
    }
    catch (err) {
        return false;
    }
}

const CheckMermaConsistency = (merma: MermaInput) => {
    for (let index = 0; index < merma.productos.length; index++) {
        const prod = merma.productos[index];

        if (prod.cantidad <= 0) { throw "Una merma no puede tener una cantidad igual o inferior a cero" }
    }
}
