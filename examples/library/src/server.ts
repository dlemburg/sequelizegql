import { ApolloServer } from 'apollo-server-express';
import { getGraphqlSchema } from './graphql';

export const createApolloServer = async () => {
  const { schema, plugins, formatResponse, context } = await getGraphqlSchema();
  const server = new ApolloServer({
    schema,
    plugins,
    context,
    formatResponse,
  });

  return server;
};
