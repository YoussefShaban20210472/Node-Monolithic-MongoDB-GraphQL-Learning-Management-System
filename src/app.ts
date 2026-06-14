import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs, resolvers } from "./graphql/assemble.js";
import { sessionMiddleware } from "./session/session.js";
import security from "./security/security.js";
// import { logger } from "./log/logger.js";
// import { pinoHttp } from "pino-http";
const app = express();
app.use(security);
app.use(sessionMiddleware);
app.use(express.json());
// app.use(
//   pinoHttp({
//     logger,
//   }),
// );

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req, res }) => ({
      req,
      res,
    }),
  }),
);

export default app;
