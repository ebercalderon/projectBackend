"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCierresFileResolver = exports.uploadVentasFileResolver = exports.uploadClientesFileResolver = exports.uploadProductoFileResolver = void 0;
const database_1 = require("../../../databases/database");
const cierreCreator_1 = require("../../../lib/cierreCreator");
const processCSV_1 = require("../../../lib/processCSV");
const productCreator_1 = require("../../../lib/productCreator");
const uploadProductoFileResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const pArray = (0, processCSV_1.ProcessCSV)(JSON.parse(args.csv));
        const auxProductList = (0, productCreator_1.CreateProductList)(pArray);
        let prodList = [];
        for (var i = 0; i < auxProductList.length; i++) {
            if (!IsProductValid(auxProductList[i])) {
                continue;
            }
            const prodName = auxProductList[i].nombre;
            const prodEAN = auxProductList[i].ean;
            const prodRepetidoEnCSV = prodList.some(p => p.nombre === auxProductList[i].nombre || p.ean === auxProductList[i].ean);
            const yaExisteProducto = yield db.ProductDBController.CollectionModel.exists({ nombre: prodName });
            if (yaExisteProducto || prodRepetidoEnCSV) {
                continue;
            }
            const yaExisteEAN = yield db.ProductDBController.CollectionModel.exists({ ean: prodEAN });
            if (yaExisteEAN) {
                continue;
            }
            prodList.push(auxProductList[i]);
        }
        const res = yield db.ProductDBController.CollectionModel.insertMany(prodList);
        if (res.length <= 0) {
            return { message: `No se ha podido añadir los productos a la base de datos`, successful: false };
        }
        if (res.length === prodList.length) {
            return { message: `Los productos han sido añadidos en la base de datos`, successful: true };
        }
        return { message: `No se ha podido añadir todos los productos a la base de datos`, successful: false };
    }
    catch (err) {
        console.log(err);
        return { message: `Error al añadir los productos en la base de datos`, successful: false };
    }
});
exports.uploadProductoFileResolver = uploadProductoFileResolver;
const uploadClientesFileResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const pArray = (0, processCSV_1.ProcessCSV)(JSON.parse(args.csv));
        return { message: `Error al añadir los clientes en la base de datos: No implementado`, successful: false };
    }
    catch (err) {
        console.log(err);
        return { message: `Error al añadir los clientes en la base de datos`, successful: false };
    }
});
exports.uploadClientesFileResolver = uploadClientesFileResolver;
const uploadVentasFileResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const ventasJson = JSON.parse(JSON.parse(args.ventasJson));
        let tpv = yield db.TPVDBController.CollectionModel.findOne({ nombre: { "$regex": ventasJson[0].tpv, "$options": "i" } });
        if (!tpv) {
            tpv = new db.TPVDBController.CollectionModel({
                nombre: `TPV${ventasJson[0].tpv}`,
                libre: true,
                cajaInicial: 0,
                enUsoPor: {
                    nombre: "",
                    apellidos: "",
                    dni: "",
                    rol: "",
                    email: "",
                }
            });
            if (!tpv) {
                return { message: `Error al añadir las ventas. Ninguna TPV asociada a dichas ventas`, successful: false };
            }
        }
        let ventas = [];
        for (let i = 0; i < ventasJson.length; i++) {
            let v = ventasJson[i];
            v.tpv = tpv._id;
            ventas.push(v);
        }
        const res = yield db.VentasDBController.CollectionModel.insertMany(ventas);
        if (res.length <= 0) {
            return { message: `No se ha podido añadir las ventas a la base de datos`, successful: false };
        }
        if (res.length === ventas.length) {
            return { message: `Las ventas han sido añadidos en la base de datos`, successful: true };
        }
        return { message: `No se ha podido añadir todos las ventas a la base de datos`, successful: false };
    }
    catch (err) {
        console.log(err);
        return { message: `Error al añadir las ventas en la base de datos`, successful: false };
    }
});
exports.uploadVentasFileResolver = uploadVentasFileResolver;
const uploadCierresFileResolver = (root, args, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = database_1.Database.Instance();
        const cArray = (0, processCSV_1.ProcessCSV)(JSON.parse(args.csv));
        let auxCierreList;
        const empleadoObject = yield db.EmployeeDBController.CollectionModel.find({});
        const empleado = empleadoObject.pop();
        if (!empleado) {
            return { message: `No se pueden añadir cierres sin al menos un empleado en el sistema`, successful: false };
        }
        const tpv = yield db.TPVDBController.CollectionModel.findOne({ nombre: cArray[0].TPV });
        if (!tpv) {
            return { message: `No se pueden añadir cierres de una TPV no existente`, successful: false };
        }
        auxCierreList = (0, cierreCreator_1.CreateCierreList)(cArray, empleado, tpv._id);
        const res = yield db.CierreTPVDBController.CollectionModel.insertMany(auxCierreList);
        if (res.length <= 0) {
            return { message: `No se ha podido añadir los cierres a la base de datos`, successful: false };
        }
        if (res.length === auxCierreList.length) {
            return { message: `Los cierres han sido añadidos en la base de datos`, successful: true };
        }
        return { message: `No se ha podido añadir todos los cierres a la base de datos`, successful: false };
    }
    catch (err) {
        console.log(err);
        return { message: `Error al añadir los cierres en la base de datos`, successful: false };
    }
});
exports.uploadCierresFileResolver = uploadCierresFileResolver;
const IsProductValid = (producto) => {
    if (!producto.nombre || producto.nombre === null || producto.nombre === undefined) {
        return false;
    }
    if (producto.precioCompra === undefined || producto.precioCompra < 0) {
        return false;
    }
    if (producto.precioVenta === undefined || producto.precioVenta < 0) {
        return false;
    }
    if (producto.ean === undefined || producto.ean === null || !producto.ean) {
        return false;
    }
    return true;
};
