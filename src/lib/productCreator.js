"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductList = exports.CreateProduct = void 0;
const CreateProduct = (jsonData) => {
    let alta = jsonData.alta;
    if (alta === "TRUE" || alta === 1 || alta === "true" || alta === "True") {
        alta = true;
    }
    else {
        alta = false;
    }
    const producto = {
        _id: jsonData.ID || jsonData._id,
        nombre: jsonData.NOMBRE || jsonData.nombre,
        proveedor: jsonData.PROVEEDOR || jsonData.proveedor,
        familia: jsonData.FAMILIA || jsonData.familia,
        precioVenta: jsonData.PRECIO_VENTA || jsonData.precioVenta,
        precioCompra: jsonData.PRECIO_COMPRA || jsonData.precioCompra,
        iva: jsonData.IVA || jsonData.iva || 0,
        margen: jsonData.MARGEN || jsonData.margen,
        promociones: jsonData.PROMOCIONES || jsonData.promociones,
        ean: jsonData.EAN || jsonData.ean,
        alta: jsonData.ALTA || alta || true,
        cantidad: jsonData.CANTIDAD || jsonData.cantidad,
        cantidadRestock: jsonData.CANTIDAD_RESTOCK || jsonData.cantidadRestock,
    };
    if (!producto._id) {
        delete producto._id;
    }
    return producto;
};
exports.CreateProduct = CreateProduct;
const CreateProductList = (jsonDataArray) => {
    let productList = [];
    for (var i = 0; i < jsonDataArray.length; i++) {
        const p = (0, exports.CreateProduct)(jsonDataArray[i]);
        productList.push(p);
    }
    return productList;
};
exports.CreateProductList = CreateProductList;
