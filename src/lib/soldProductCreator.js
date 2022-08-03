"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSoldProductList = exports.CreateSoldProduct = void 0;
const CreateSoldProduct = (jsonData) => {
    const producto = {
        nombre: jsonData.NOMBRE,
        familia: jsonData.FAMILIA,
        cantidadVendida: jsonData.CANTIDADVENDIDA,
        dto: jsonData.DTO,
        ean: jsonData.EAN,
        iva: jsonData.IVA,
        precioCompra: jsonData.PRECIOCOMPRA,
        precioVenta: jsonData.PRECIOVENTA,
        margen: jsonData.MARGEN,
        proveedor: jsonData.PROVEEDOR,
    };
    return producto;
};
exports.CreateSoldProduct = CreateSoldProduct;
const CreateSoldProductList = (jsonDataArray) => {
    let productList = [];
    for (var i = 0; i < jsonDataArray.length; i++) {
        const p = (0, exports.CreateSoldProduct)(jsonDataArray[i]);
        productList.push(p);
    }
    return productList;
};
exports.CreateSoldProductList = CreateSoldProductList;
