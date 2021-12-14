import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { init } from './orm/sequelize';
import { getGraphqlSchema } from './graphql';

export let app;

async function startApolloServer() {
  const app = express();

  app.use(bodyParser.json());

  app.use((err, req, res, next) => {
    console.error(`[${err.message}]: ${err.stack}`);
    res.status(500).send({ err: err.message });
  });

  const httpServer = http.createServer(app);
  const { schema } = await getGraphqlSchema();
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

async function main() {
  init();
  startApolloServer();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
