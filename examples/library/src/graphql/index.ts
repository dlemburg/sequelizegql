import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { getSchema } from './schemas';
import { EXAMPLES } from './schemas/example-initialization-input-options';

const context = async ({ req }): Promise<Record<string, any>> => {
  return {};
};

export const getGraphqlSchema = async (): Promise<any> => {
  const middlewares = [];
  const { typeDefs, resolvers } = await getSchema(EXAMPLES.pathOnly);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(schema, ...middlewares);

  return {
    schema: schemaWithMiddleware,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context,
    middleware: [],
  };
};
