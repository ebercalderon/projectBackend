import { Document } from 'mongoose';
import { IClient } from './Cliente';
import { IEmployee } from './Empleado';
import { ISoldProduct } from './Producto';
import { ITPV } from './TPV';

export interface ISale extends Document {
    productos: ISoldProduct[],
    dineroEntregadoEfectivo: number,
    dineroEntregadoTarjeta: number,
    precioVentaTotalSinDto: number,
    precioVentaTotal: number,
    cambio: number,
    cliente: IClient,
    vendidoPor: IEmployee,
    modificadoPor: IEmployee,
    tipo: string,
    descuentoEfectivo: number,
    descuentoPorcentaje: number,
    tpv: ITPV['_id'],
}
