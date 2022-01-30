import { startApolloServer } from './apollo-server';
import { init as initDataLayer } from './orm/sequelize';

export let app;

async function main() {
  await initDataLayer();
  await startApolloServer();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
