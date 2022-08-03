import { Document } from 'mongoose';
import { IEmployee } from './Empleado';
import { ILostProduct } from './Producto';

export interface IMerma extends Document {
    productos: ILostProduct[],
    creadoPor: IEmployee,
    modificadoPor: IEmployee,
}
