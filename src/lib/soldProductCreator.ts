import { ISoldProduct } from "../types/Producto";

export const CreateSoldProduct = (jsonData: any): ISoldProduct => {

    const producto: ISoldProduct = {
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
    } as ISoldProduct;

    return producto;
}

export const CreateSoldProductList = (jsonDataArray: any): ISoldProduct[] => {
    let productList: ISoldProduct[] = [];
    for (var i = 0; i < jsonDataArray.length; i++) {
        const p = CreateSoldProduct(jsonDataArray[i]);

        productList.push(p);
    }

    return productList;
}