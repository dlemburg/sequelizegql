import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { getSchema } from './schemas';
import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/options';
import { sequelize } from '../orm/sequelize';

const context = async ({ req }): Promise<Record<string, any>> => {
  return {};
};

export const getGraphqlSchema = async (options): Promise<any> => {
  const middlewares = [];
  const { typedefs: typeDefs, resolvers } = await getSchema(options);
  const schema = makeExecutableSchema({ typeDefs, resolvers } as any);
  const schemaWithMiddleware = applyMiddleware(schema, ...middlewares);

  return {
    schema: schemaWithMiddleware,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context,
    middleware: [],
  };
};
