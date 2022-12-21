import mongoose from "mongoose";
import { Database } from "../../../databases/database";
import { IProveedor, IProveedorContacto } from "../../../types/Proveedor";

export const proveedoresResolver = async (parent: any, args: { find: any, limit: number }, context: any, info: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    // Comprueba si find es null, undefined o vacío
    if (args.find === null || !args.find || Object.keys(args.find).length === 0 && args.find.constructor === Object) {

        const prooveedores = await db.ProveedorDBController.CollectionModel.find()
            .limit(args.limit || 150)
            .exec();

        return prooveedores;
    }

    if (args.find?.query) {
        const query = args.find.query;
        const isQueryValidId = mongoose.Types.ObjectId.isValid(query);

        let prooveedores = {};
        if (isQueryValidId) {
            prooveedores = await db.ProveedorDBController.CollectionModel.find({ _id: query })
                .limit(args.limit || 150)
                .exec();
        }
        else {
            prooveedores = await db.ProveedorDBController.CollectionModel.find({
                $or: [
                    { nombre: { "$regex": query, "$options": "i" } },
                    { email: { "$regex": query, "$options": "i" } },
                    { contacto: { "$regex": query, "$options": "i" } },
                    { localidad: { "$regex": query, "$options": "i" } },
                    { pais: { "$regex": query, "$options": "i" } },
                    { provincia: { "$regex": query, "$options": "i" } },
                    { cp: { "$regex": query, "$options": "i" } },
                    { direccion: { "$regex": query, "$options": "i" } },
                ]
            })
                .limit(args.limit || 150)
                .exec();
        }

        return prooveedores;
    }

    return [];
}

export const addProveedorResolver = async (root: any, args: { fields: IProveedor }, context: any) => {
    const db = Database.Instance();

    const prov = await db.ProveedorDBController.CollectionModel.exists({ nombre: args.fields.nombre });
    if (prov) {
        return { message: "Nombre del proveedor en uso", successful: false, data: null }
    }

    const cif = await db.ProveedorDBController.CollectionModel.exists({ nombre: args.fields.cif });
    if (cif) {
        return { message: "El CIF del proveedor está en uso", successful: false, data: null }
    }

    const proveedorContacto: IProveedorContacto = {
        nombre: args.fields.contacto?.nombre || "",
        telefono: args.fields.contacto?.telefono || "",
        email: args.fields.contacto?.email || ""
    }

    const updatedProv: mongoose.Document<IProveedor> = new db.ProveedorDBController.CollectionModel({
        nombre: args.fields.nombre,
        cif: args.fields.cif,
        direccion: args.fields.direccion,
        contacto: proveedorContacto,
        telefono: args.fields.telefono,
        localidad: args.fields.localidad,
        provincia: args.fields.provincia,
        cp: args.fields.cp,
        pais: args.fields.pais,
        email: args.fields.email,
        nombreContacto: args.fields.contacto,
    } as unknown as IProveedor);

    const resultado = await updatedProv.save();
    if (resultado.id) {
        return { message: "Proveedor añadido correctamente", successful: true, data: resultado }
    }

    return { message: "No se ha podido añadir el proveedor", successful: false, data: null }
}

export const deleteProveedorResolver = async (root: any, args: { _id: string }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const db = Database.Instance();

    const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de proveedor inválido", successful: false }
    }

    const deletedProd = await db.ProveedorDBController.CollectionModel.deleteOne({ _id: args._id });

    if (deletedProd.deletedCount > 0) {
        return { message: "Proveedor eliminado correctamente", successful: true }
    }

    return { message: "No se ha podido eliminar el proveedor", successful: false }
}

export const updateProveedorResolver = async (root: any, args: { _id: string, proveedor: IProveedor }, context: any) => {
    // Check de autenticidad para aceptar peticiones válidas. Descomentar en producción
    // if (!context.user) { throw new UserInputError('Usuario sin autenticar'); }

    const isQueryValidId = mongoose.Types.ObjectId.isValid(args._id);
    if (!isQueryValidId) {
        return { message: "ID de proveedor inválido", successful: false }
    }

    const db = Database.Instance();
    const updatedProv = {
        nombre: args.proveedor.nombre,
        cif: args.proveedor.cif,
        direccion: args.proveedor.direccion,
        contacto: args.proveedor.contacto,
        telefono: args.proveedor.telefono,
        localidad: args.proveedor.localidad,
        provincia: args.proveedor.provincia,
        cp: args.proveedor.cp,
        pais: args.proveedor.pais,
        email: args.proveedor.email,
    } as unknown as IProveedor;

    const resultadoUpdate = await db.ProveedorDBController.CollectionModel.updateOne({ _id: args._id }, { $set: updatedProv });

    if (resultadoUpdate.modifiedCount > 0) {
        return { message: "Proveedor actualizado correctamente", successful: true }
    }

    return { message: "No se ha podido actualizar el proveedor", successful: false }
}