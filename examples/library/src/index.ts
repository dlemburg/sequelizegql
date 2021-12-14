import express from 'express';
import bodyParser from 'body-parser';
import { createApolloServer } from './server';
import { init } from './orm/sequelize';

export let app;

async function main() {
  init();
  const port = 4000;
  app = express();

  app.use(bodyParser.json());

  app.use((err, req, res, next) => {
    console.error(`[${err.message}]: ${err.stack}`);
    res.status(500).send({ err: err.message });
  });

  const server = await createApolloServer();
  await server.start();

  server.applyMiddleware({
    app,
  });

  await new Promise((resolve) => resolve(app.listen({ port })));
  console.log(`🚀 Server ready at http://localhost:${port}`, { port });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
