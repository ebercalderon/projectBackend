import { Document } from 'mongoose';
import { IEmployee } from './Empleado';
import { IProductoMermado } from './Producto';

export interface IMerma extends Document {
    productos: IProductoMermado[],
    creadoPor: IEmployee,
    costeProductos: number,
    ventasPerdidas: number,
    beneficioPerdido: number,
    createdAt: string,
    updatedAt: string
}
