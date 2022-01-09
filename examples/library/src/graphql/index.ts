import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { getSchema } from './schemas';
import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/example-initialization-input-options';

const context = async ({ req }): Promise<Record<string, any>> => {
  return {};
};

export const getGraphqlSchema = async (): Promise<any> => {
  const middlewares = [];
  const { typedefs: typeDefs, resolvers } = await getSchema(
    EXAMPLE_INITIALIZATION_OPTIONS.pathOnlyApplicationExample
  );
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(schema, ...middlewares);

  return {
    schema: schemaWithMiddleware,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context,
    middleware: [],
  };
};
