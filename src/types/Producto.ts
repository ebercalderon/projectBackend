import { Document } from 'mongoose';

export interface IProduct extends Document {
    nombre: string
    proveedor: string
    familia: string
    precioVenta: number
    precioCompra: number
    iva: number
    margen: number
    promociones: string[]
    ean: string
    cantidad: number
    cantidadRestock: number
    alta: boolean
}

export interface ISoldProduct extends Document {
    nombre: string,
    familia: string,
    precioVenta: number,
    precioCompra: number,
    precioFinal: number,
    cantidadVendida: number,
    dto: number,
    iva: number,
    margen: number,
    proveedor: string
    ean: string
}

export interface IReturnProduct extends Document {
    nombre: string,
    familia: string,
    precioVenta: number,
    precioCompra: number
    precioFinal: number,
    cantidadDevuelta: number,
    dto: number,
    iva: number,
    margen: number,
    proveedor: string
    ean: string
}

export interface ILostProduct extends Document {
    nombre: string
    proveedor: string
    familia: string
    precioVenta: number
    precioCompra: number
    precioFinal: number
    iva: number
    margen: number
    ean: string
    cantidadMerma: number
}