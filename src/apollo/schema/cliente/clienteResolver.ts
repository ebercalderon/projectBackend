import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import { Database } from "../../../databases/database"
import { IClient } from "../../../types/Cliente";
import { ClienteFind, ClientesFind } from "../../../types/types";

export const clienteResolver = async (parent: any, args: ClienteFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) throw new UserInputError('Argumentos inválidos: Find no puede estar vacío');

    const db = Database.Instance();

    if (args.find._id) {
        const c = await db.ClientDBController.CollectionModel.findOne({ _id: args.find._id }).exec();

        if (c) return c;
    }

    if (args.find.nif) {
        const c = await db.ClientDBController.CollectionModel.findOne({ nif: args.find.nif }).exec();

        if (c) return c;
    }

    if (args.find.nombre) {
        const c = await db.ClientDBController.CollectionModel.findOne({ nombre: { "$regex": args.find.nombre, "$options": "i" } }).exec();

        if (c) return c;
    }

    return null;
}

export const clientesResolver = async (parent: any, args: ClientesFind, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Comprueba si find es null, undefined o vacío
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {
        const clientes = await db.ClientDBController.CollectionModel.find({}).limit(args.limit || 3000).exec();

        if (clientes) return clientes;
    }

    if (args.find?._ids) {
        const clientes = await db.ClientDBController.CollectionModel.find({ _id: args.find._ids })
            .limit(args.limit || 3000)
            .exec();

        if (clientes) return clientes;
    }

    if (args.find?.nombre) {
        const clientes = await db.ClientDBController.CollectionModel.find({ nombre: { "$regex": args.find.nombre, "$options": "i" } })
            .limit(args.limit || 3000)
            .exec();

        if (clientes) return clientes;
    }

    if (args.find?.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose.Types.ObjectId.isValid(query);

        let clientes = {};
        if (isQueryValidId) {
            clientes = await db.ClientDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();
        }
        else {
            clientes = await db.ClientDBController.CollectionModel.find({
                $or: [
                    { nombre: { "$regex": query, "$options": "i" } },
                    { calle: { "$regex": query, "$options": "i" } },
                    { cp: { "$regex": query, "$options": "i" } },
                    { nif: { "$regex": query, "$options": "i" } }
                ]
            })
                .limit(args.limit || 150)
                .exec();
        }

        return clientes;
    }

    return [];
}

export const addClienteResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    const CifEnUso = await db.ClientDBController.CollectionModel.find({ nif: args.nif });
    if (CifEnUso.length > 0) {
        return { message: "El CIF ya está en uso", successful: false }
    }

    const newClient: mongoose.Document<IClient> = new db.ClientDBController.CollectionModel({
        nombre: args.nombre,
        calle: args.calle,
        cp: args.cp,
        nif: args.nif
    } as IClient);

    const resultado = await newClient.save();

    if (resultado.id) {
        return { message: "Cliente creado correctamente", successful: true }
    }

    return { message: "No se ha podido crear el cliente", successful: false }
}

export const deleteClienteResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }
    const db = Database.Instance();

    const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID del cliente inválido", successful: false }
    }

    const deletedProd = await db.ClientDBController.CollectionModel.deleteOne({ _id: args._id });

    if (deletedProd.deletedCount > 0) {
        return { message: "Cliente eliminado correctamente", successful: true }
    }

    return { message: "No se ha podido eliminar el cliente", successful: false }
}

export const updateClienteResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID del cliente inválido", successful: false }
    }

    if (!args.nif) {
        return { message: "El CIF del cliente no puede estar vacío", successful: false }
    }

    const db = Database.Instance();

    const updatedClient = {
        _id: args._id,
        nombre: args.nombre,
        calle: args.calle,
        cp: args.cp,
        nif: args.nif
    } as IClient;

    const resultadoUpdate = await db.ClientDBController.CollectionModel.updateOne({ _id: args._id }, { $set: updatedClient });

    if (resultadoUpdate.modifiedCount > 0) {
        return { message: "Cliente actualizado correctamente", successful: true }
    }

    return { message: "No se ha podido actualizar el cliente", successful: false }

}

export const uploadClienteFileResolver = async (root: any, args: any, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

}


