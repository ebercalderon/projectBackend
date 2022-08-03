import { IClient } from "../types/Cliente";
import { IEmployee } from "../types/Empleado";
import { ISale } from "../types/Venta";
import { CreateSoldProductList } from "./soldProductCreator";

export const CreateSale = (jsonData: any): ISale => {
    const fecha: Date = new Date(jsonData.FECHA);

    const producto: ISale = {
        cambio: jsonData.CAMBIO,
        cliente: {
            calle: jsonData.CLIENTE_CALLE,
            cp: jsonData.CLIENTE_CP,
            nombre: jsonData.CLIENTE_NOMBRE,
            nif: jsonData.CLIENTE_CIF
        } as IClient,
        descuentoEfectivo: jsonData.DESCUENTO_EFECTIVO,
        descuentoPorcentaje: jsonData.DESCUENTO_PORCENTAJE,
        dineroEntregadoEfectivo: jsonData.DINERO_ENTREGADO_EFECTIVO,
        dineroEntregadoTarjeta: jsonData.DINERO_ENTREGADO_TARJETA,
        precioVentaTotal: jsonData.PRECIO_VENTA_TOTAL,
        precioVentaTotalSinDto: jsonData.PRECIO_VENTA_TOTAL_SINDTO,
        tpv: jsonData.TPV,
        tipo: jsonData.TIPO,
        vendidoPor: {
            apellidos: jsonData.EMPLEADO_VENDIDO_APELLIDOS,
            email: jsonData.EMPLEADO_VENDIDO_EMAIL,
            nombre: jsonData.EMPLEADO_VENDIDO_NOMBRE,
            dni: jsonData.EMPLEADO_VENDIDO_DNI,
            rol: jsonData.EMPLEADO_VENDIDO_ROL,
        } as IEmployee,
        modificadoPor: {
            apellidos: jsonData.EMPLEADO_MODIFICADO_APELLIDOS,
            email: jsonData.EMPLEADO_MODIFICADO_EMAIL,
            nombre: jsonData.EMPLEADO_MODIFICADO_NOMBRE,
            dni: jsonData.EMPLEADO_MODIFICADO_DNI,
            rol: jsonData.EMPLEADO_MODIFICADO_ROL,
        } as IEmployee,
        productos: CreateSoldProductList(JSON.parse(jsonData.PRODUCTOS)),
        createdAt: fecha,
        updatedAt: fecha,
    } as unknown as ISale;

    return producto;
}

export const CreateSaleList = (jsonDataArray: any): ISale[] => {
    let productList: ISale[] = [];
    for (var i = 0; i < jsonDataArray.length; i++) {
        const p = CreateSale(jsonDataArray[i]);

        productList.push(p);
    }

    return productList;
}