import { Document } from 'mongoose';

export interface IProveedor extends Document {
    nombre: string,
    cif: string,
    direccion?: string,
    contacto?: IProveedorContacto,
    telefono?: string
    localidad?: string
    provincia?: string,
    cp?: string,
    pais?: string,
    email?: string,
}

export interface IProveedorContacto {
    nombre: string,
    telefono?: string
    email?: string,
}