"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CierreTPV = void 0;
const mongoose_1 = require("mongoose");
class CierreTPV {
    constructor() {
        const EmpleadoSchema = new mongoose_1.Schema({
            nombre: { type: String, requiered: true },
            apellidos: { type: String, requiered: true },
            dni: { type: String, requiered: false },
            email: { type: String, requiered: true },
            fechaAlta: { type: Date, required: false },
            rol: { type: String, requiered: true },
        }, { strict: true, timestamps: false });
        const CierreTPVSchema = new mongoose_1.Schema({
            tpv: { type: mongoose_1.Types.ObjectId, ref: 'TPV', required: true },
            abiertoPor: { type: EmpleadoSchema, required: true },
            cerradoPor: { type: EmpleadoSchema, required: true },
            apertura: { type: Date, required: true },
            cierre: { type: Date, required: true },
            cajaInicial: { type: Number, required: true },
            ventasEfectivo: { type: Number, required: true },
            ventasTarjeta: { type: Number, required: true },
            ventasTotales: { type: Number, required: true },
            dineroEsperadoEnCaja: { type: Number, required: true },
            dineroRealEnCaja: { type: Number, required: true },
            dineroRetirado: { type: Number, required: true },
            fondoDeCaja: { type: Number, required: true },
            beneficio: { type: Number, required: false },
            nota: { type: String, required: false }
        }, { strict: true });
        this.modelo = (0, mongoose_1.model)('CierresTPV', CierreTPVSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.CierreTPV = CierreTPV;
