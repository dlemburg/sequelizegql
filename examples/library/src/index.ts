import { startApolloServer } from './apollo-server';
import { EXAMPLE_INITIALIZATION_OPTIONS } from './example-entities/options';
import { init as initDataLayer } from './orm/sequelize';

export let app;

async function main() {
  const sequelize = await initDataLayer();
  await startApolloServer({
    sequelize,
    ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
