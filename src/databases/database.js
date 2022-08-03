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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productoModel_1 = require("../models/productoModel");
const ventaModel_1 = require("../models/ventaModel");
const clienteModel_1 = require("../models/clienteModel");
const ProductDBController_1 = require("./ProductDBController");
const ClientDBController_1 = require("./ClientDBController");
const SaleDBController_1 = require("./SaleDBController");
const EmployeeDBController_1 = require("./EmployeeDBController");
const employeeModel_1 = require("../models/employeeModel");
const CierreTPVDBController_1 = require("./CierreTPVDBController");
const cierreTPVModel_1 = require("../models/cierreTPVModel");
const tpvModel_1 = require("../models/tpvModel");
const TPVDBController_1 = require("./TPVDBController");
const DevolucionDBController_1 = require("./DevolucionDBController");
const devolucionModel_1 = __importDefault(require("../models/devolucionModel"));
const MermaDBController_1 = require("./MermaDBController");
const mermaModel_1 = require("../models/mermaModel");
const ProveedorDBController_1 = require("./ProveedorDBController");
const proveedorModel_1 = __importDefault(require("../models/proveedorModel"));
mongoose.Promise = global.Promise;
dotenv.config();
const dbInformation = {
    mongo: mongoose,
    url: process.env.MONGO_URI === "" ? "mongodb://localhost:27017/" : process.env.MONGO_URI,
    dbName: process.env.DATABASE_NAME == "" ? "erp_db" : process.env.DATABASE_NAME,
};
class Database {
    constructor() {
        this.db = dbInformation.mongo;
        this.ProductDBController = new ProductDBController_1.ProductoDBController(new productoModel_1.Producto().Model);
        this.VentasDBController = new SaleDBController_1.SaleDBController(new ventaModel_1.Venta().Model);
        this.ClientDBController = new ClientDBController_1.ClientDBController(new clienteModel_1.Cliente().Model);
        this.EmployeeDBController = new EmployeeDBController_1.EmployeeDBController(new employeeModel_1.Empleado().Model);
        this.CierreTPVDBController = new CierreTPVDBController_1.CierreTPVDBController(new cierreTPVModel_1.CierreTPV().Model);
        this.TPVDBController = new TPVDBController_1.TPVDBController(new tpvModel_1.TPV().Model);
        this.DevolucionDBController = new DevolucionDBController_1.DevolucionDBController(new devolucionModel_1.default().Model);
        this.MermaDBController = new MermaDBController_1.MermaDBController(new mermaModel_1.Merma().Model);
        this.ProveedorDBController = new ProveedorDBController_1.ProveedorDBController(new proveedorModel_1.default().Model);
        this.db.connect(dbInformation.url + dbInformation.dbName).then(() => {
            console.log("¡Conexión realizada con la base de datos!");
        }).catch((err) => {
            console.log("¡No se pudo realizar la conexión con la base de datos!", err);
            process.exit();
        }).then(() => __awaiter(this, void 0, void 0, function* () {
            yield this.ClientDBController.CollectionModel.findOne({ nombre: "General" }).exec().then((clienteGeneral) => {
                if (!clienteGeneral) {
                    const cliente = { nombre: "General", calle: "General", nif: "General", cp: "General" };
                    this.ClientDBController.CollectionModel.create(cliente);
                }
            });
            const numEmpleados = yield this.EmployeeDBController.CollectionModel.countDocuments({});
            if (numEmpleados <= 0) {
                const empleado = {
                    nombre: "Administrador",
                    apellidos: "Admin",
                    dni: "Administrador",
                    rol: "Administrador",
                    email: "admin@erp.com"
                };
                const pw = "admin";
                yield this.EmployeeDBController.CreateEmployee(empleado, pw);
            }
            const numTpvs = yield this.TPVDBController.CollectionModel.countDocuments({});
            if (numTpvs <= 0) {
                const TPV1 = {
                    cajaInicial: 100,
                    nombre: "TPV1",
                    libre: true,
                    enUsoPor: {
                        nombre: "Administrador",
                        apellidos: "Admin",
                        dni: "Administrador",
                        rol: "Administrador",
                        email: "admin@erp.com"
                    }
                };
                const TPV2 = {
                    cajaInicial: 100,
                    nombre: "TPV2",
                    libre: true,
                    enUsoPor: {
                        nombre: "Administrador",
                        apellidos: "Admin",
                        dni: "Administrador",
                        rol: "Administrador",
                        email: "admin@erp.com"
                    }
                };
                yield this.TPVDBController.CollectionModel.create(TPV1);
                yield this.TPVDBController.CollectionModel.create(TPV2);
            }
        }));
    }
    static Instance() {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
    get MongooseInstance() {
        return this.db;
    }
}
exports.Database = Database;
