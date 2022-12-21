import dotenv from 'dotenv';
import { Router } from './router';
import { ApolloServer } from 'apollo-server-express';
import TypeDefs from './apollo/TypeDefs';
import Resolvers from './apollo/Resolvers';

// Para leer en la variable .env
dotenv.config();

// Crea las rutas del API y las enruta
let apiRouter = new Router();

// set port, listen for requests
const PORT = process.env.PORT || 5151;
const gatewayUrl = process.env.ERPGATEWAY_URL;
if (!gatewayUrl) { throw "GATEWAY_URL no encontrado" }

const corsOptions = {
  origin: [gatewayUrl, "https://studio.apollographql.com", "http://localhost:8080/", "http://0.0.0.0:8080/"]
};

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext: any) {
    try {
      const fecha = new Date(Date.now());
      console.log('------------------------------------');
      console.log('Petición recibida a las ' + fecha.toLocaleString());

      return {
        // Fires whenever Apollo Server will parse a GraphQL
        // request to create its associated document AST.
        // async parsingDidStart(requestContext: any) {
        //   console.log('Parseando petición!');
        // },

        // // Fires whenever Apollo Server will validate a
        // // request's document AST against your GraphQL schema.
        // async validationDidStart(requestContext: any) {
        //   console.log('Validando petición!');
        // },
        async willSendResponse(context: any) {
          console.log(`Nombre de la ${context.operation!.operation}:`, Object.keys(context.response.data!)[0]);
        },
      }
    }
    catch (err) {
      console.error(err);
    }
  },
};

const server = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: Resolvers,
  csrfPrevention: true,
  plugins: [myPlugin],
  context: ({ req }) => ({
    user: req.user
  })
});

async function startApolloServer() {
  // Inicia apollo server (hay un bug que obliga hacerlo de esta forma)
  await server.start();

  // Añadir serverRegistration a Apollo
  server.applyMiddleware({
    app: apiRouter.App,
    cors: corsOptions,
    bodyParserConfig: {
      limit: '100mb'
    }
  });

  // Enruta los diferentes componentes del api
  apiRouter.SetRoutes();
}

// Inicia el servidor
startApolloServer();

// Inicia el listener en los puertos
apiRouter.App.listen(PORT, () => {
  console.log(`Servidor en marcha: puerto ${PORT}.`);
});

