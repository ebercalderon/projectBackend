import { UserInputError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { Database } from "../../../databases/database";

export const jwtValidatorResolver = async (parent: any, args: { jwt: string }, context: any, info: any) => {
    if (args === null || !args || Object.keys(args).length === 0 && args.constructor === Object) throw new UserInputError('Argumentos inválidos: Jwt no puede estar vacío');
    if (!args.jwt || !args.jwt) { throw new UserInputError('Jwt no puede estar vacío'); }

    try {
        const secret = process.env.JWT_SECRET;

        if (secret) {
            const validado: any = jwt.verify(args.jwt, secret);
            const db = Database.Instance();

            const empleadoValidado = await db.EmployeeDBController.CollectionModel.findOne({ _id: validado._id }).exec();
            if (empleadoValidado) {
                return {
                    validado: true
                };
            }

            return {
                validado: false
            };
        }

        return { validado: false }
    }
    catch (err) {
        return { validado: false }
    }
}
