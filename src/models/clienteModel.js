"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
const mongoose_1 = require("mongoose");
class Cliente {
    constructor() {
        const ClientSchema = new mongoose_1.Schema({
            nif: { type: String, required: true },
            nombre: { type: String, required: true },
            calle: { type: String, required: true },
            cp: { type: String, required: true },
        }, { strict: true });
        this.modelo = (0, mongoose_1.model)('Cliente', ClientSchema);
    }
    get Model() {
        return this.modelo;
    }
}
exports.Cliente = Cliente;
