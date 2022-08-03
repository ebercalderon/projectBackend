import { Document } from 'mongoose';
import { IClient } from './Cliente';
import { IEmployee } from './Empleado';
import { ISoldProduct } from './Producto';
import { ITPV } from './TPV';
import { ISale } from './Venta';

export interface IDevolucion extends Document {
    productosDevueltos: ISoldProduct[],
    dineroDevuelto: number,
    cliente: IClient | string,
    trabajador: IEmployee,
    modificadoPor: IEmployee,
    tpv: ITPV['_id'],
    ventaOriginal: ISale
}
