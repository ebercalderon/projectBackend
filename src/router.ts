import { Database } from './databases/database.js';
import express, { Request, Response } from 'express';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import cors from 'cors';

export class Router {
    public app;
    public database: Database;

    constructor() {
        this.app = express();
        this.database = Database.Instance();
    }

    public SetRoutes() {
        const gatewayUrl = process.env.ERPGATEWAY_URL;
        if (!gatewayUrl) { throw "GATEWAY_URL no encontrado" }

        this.app.use(cors({ origin: gatewayUrl })); // --> En produccion

        const { Strategy, ExtractJwt } = passportJWT;
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        };

        // Selecciona la estrategia
        passport.use(new Strategy(params, async (jwtPayload, done) => {
            try {
                console.log("Searchup for the user");
                const user = await Database.Instance().EmployeeDBController.CollectionModel.findOne({ _id: jwtPayload.id }).exec();

                if (user) { return done(null, user); }
                return done("User not found", false);
            }
            catch (err) {
                return done(err, false);
            }
        }));

        // parse requests of content-type - application/json
        this.app.use(express.json({ limit: '10mb' }));

        // parse requests of content-type - application/x-www-form-urlencoded
        this.app.use(express.urlencoded({ limit: '10mb', parameterLimit: 100000, extended: true }));

        this.app.get("/api", (req: Request, res: Response) => {
            res.json({ message: "Bienvenido al API Restful de ERPSolution" });
        });

        // Añade passport al endpoint de graphql
        this.app.use('/graphql',
            (req, res, next) => {
                passport.authenticate('jwt', { session: false }, (err, user, info) => {
                    if (user) {
                        req.user = user
                    }
                    next();
                })(req, res, next)
            }
        );

        passport.initialize();
    }

    public get App() {
        return this.app;
    }
}