import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import SequelizeGraphql from 'sequelizegql';
import { startApolloServer } from './apollo-server';
import { init as initDataLayer } from './orm/sequelize';

export const getSchema = async (options) => {
  return SequelizeGraphql().generateSchema(options);
};

export const getGraphqlSchema = async (options): Promise<any> => {
  const { typedefs: typeDefs, resolvers } = await getSchema(options);
  const schema = makeExecutableSchema({ typeDefs, resolvers } as any);

  return {
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    middleware: [],
  };
};

async function main() {
  const sequelize = await initDataLayer();
  const { schema } = await getGraphqlSchema({ sequelize });
  await startApolloServer(schema);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
