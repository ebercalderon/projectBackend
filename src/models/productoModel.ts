import { Schema, model, Model } from 'mongoose';
import { IProduct } from '../types/Producto';
import { IProveedor } from '../types/Proveedor';

export class Producto {
  private modelo: Model<IProduct>;

  constructor() {
    // const ProveedorSchema = new Schema({
    //   nombre: { type: String, requiered: true },
    //   cif: { type: String, requiered: true },
    //   telefono: { type: String, requiered: false },
    //   direccion: { type: String, requiered: false },
    //   localidad: { type: String, requiered: false },
    //   provincia: { type: String, requiered: false },
    //   cp: { type: String, requiered: false },
    //   pais: { type: String, requiered: false },
    //   email: { type: String, requiered: false },
    //   nombreContacto: { type: String, requiered: false },
    // }, { strict: true, timestamps: false }) as Schema<IProveedor>;

    const ProductSchema = new Schema({
      nombre: { type: String, required: true },
      proveedor: { type: String, required: false },
      familia: { type: String, required: false },
      precioVenta: { type: Number, required: true },
      precioCompra: { type: Number, required: true },
      iva: { type: Number, required: false },
      ean: { type: String, required: true },
      margen: { type: Number, required: false },
      alta: { type: Boolean, required: false },
      cantidad: { type: Number, required: false },
      cantidadRestock: { type: Number, required: false },
    }, { strict: true, timestamps: true }) as Schema<IProduct>;

    this.modelo = model<IProduct>('Producto', ProductSchema);
  }

  public get Model(): Model<IProduct> {
    return this.modelo;
  }
}
