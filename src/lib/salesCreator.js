"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSaleList = exports.CreateSale = void 0;
const soldProductCreator_1 = require("./soldProductCreator");
const CreateSale = (jsonData) => {
    const fecha = new Date(jsonData.FECHA);
    const producto = {
        cambio: jsonData.CAMBIO,
        cliente: {
            calle: jsonData.CLIENTE_CALLE,
            cp: jsonData.CLIENTE_CP,
            nombre: jsonData.CLIENTE_NOMBRE,
            nif: jsonData.CLIENTE_CIF
        },
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
        },
        modificadoPor: {
            apellidos: jsonData.EMPLEADO_MODIFICADO_APELLIDOS,
            email: jsonData.EMPLEADO_MODIFICADO_EMAIL,
            nombre: jsonData.EMPLEADO_MODIFICADO_NOMBRE,
            dni: jsonData.EMPLEADO_MODIFICADO_DNI,
            rol: jsonData.EMPLEADO_MODIFICADO_ROL,
        },
        productos: (0, soldProductCreator_1.CreateSoldProductList)(JSON.parse(jsonData.PRODUCTOS)),
        createdAt: fecha,
        updatedAt: fecha,
    };
    return producto;
};
exports.CreateSale = CreateSale;
const CreateSaleList = (jsonDataArray) => {
    let productList = [];
    for (var i = 0; i < jsonDataArray.length; i++) {
        const p = (0, exports.CreateSale)(jsonDataArray[i]);
        productList.push(p);
    }
    return productList;
};
exports.CreateSaleList = CreateSaleList;
