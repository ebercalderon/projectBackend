import { Document } from 'mongoose';

export interface IEmployee extends Document {
    nombre: string,
    apellidos: string,
    dni: string,
    rol: string,
    email: string,
    hashPassword: string,
    fechaAlta?: Date,
}

export interface IOldEmployee extends Document {
    nombre: string
    apellidos: string
    dni: string
    genero: string
    email: string
    fechaBaja: Date
}