import { startApolloServer } from './apollo-server';
import { init as initDataLayer } from './orm/sequelize';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import SequelizeGraphql from '../../../src';
import { InitializeInput, InitializeResponse } from '../../../src/types';

export const getSchema = async (options: InitializeInput): Promise<InitializeResponse> => {
  const graphqlSequelize = SequelizeGraphql();
  const schema = await graphqlSequelize.generateSchema(options);

  // graphqlSequelize.printConsole();
  // graphqlSequelize.outputTypedefs();

  return schema;
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
