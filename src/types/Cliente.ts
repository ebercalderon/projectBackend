import { Document, ObjectId } from 'mongoose';

export interface IClient extends Document {
    nif: string,
    nombre: string,
    calle: string,
    cp: string
}