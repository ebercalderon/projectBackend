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
exports.Router = void 0;
const database_js_1 = require("./databases/database.js");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const cors_1 = __importDefault(require("cors"));
class Router {
    constructor() {
        this.app = (0, express_1.default)();
        this.database = database_js_1.Database.Instance();
    }
    SetRoutes() {
        const gatewayUrl = process.env.ERPGATEWAY_URL;
        if (!gatewayUrl) {
            throw "GATEWAY_URL no encontrado";
        }
        this.app.use((0, cors_1.default)({ origin: gatewayUrl }));
        const { Strategy, ExtractJwt } = passport_jwt_1.default;
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        };
        passport_1.default.use(new Strategy(params, (jwtPayload, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Searchup for the user");
                const user = yield database_js_1.Database.Instance().EmployeeDBController.CollectionModel.findOne({ _id: jwtPayload.id }).exec();
                if (user) {
                    return done(null, user);
                }
                return done("User not found", false);
            }
            catch (err) {
                return done(err, false);
            }
        })));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '10mb', parameterLimit: 100000, extended: true }));
        this.app.get("/api", (req, res) => {
            res.json({ message: "Bienvenido al API Restful de ERPSolution" });
        });
        this.app.use('/graphql', (req, res, next) => {
            passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
                if (user) {
                    req.user = user;
                }
                next();
            })(req, res, next);
        });
        passport_1.default.initialize();
    }
    get App() {
        return this.app;
    }
}
exports.Router = Router;
