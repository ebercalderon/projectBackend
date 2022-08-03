import { Document } from 'mongoose';
import { IEmployee } from './Empleado';

export interface ITPV extends Document {
    nombre: string
    enUsoPor: IEmployee
    libre: boolean
    cajaInicial: number
}

export interface ICierreTPV extends Document {
    tpv: ITPV["_id"],
    abiertoPor: IEmployee
    cerradoPor: IEmployee
    apertura: Date
    cierre: Date
    cajaInicial: number
    numVentas: number,
    ventasEfectivo: number,
    ventasTarjeta: number,
    ventasTotales: number,
    dineroEsperadoEnCaja: number,
    dineroRealEnCaja: number,
    dineroRetirado: number,
    fondoDeCaja: number,
    beneficio?: number,
    nota?: string
}