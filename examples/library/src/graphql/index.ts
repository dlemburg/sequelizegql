import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { applyMiddleware } from 'graphql-middleware';
import { getSchema } from './schemas';
// import { getSerializer } from './serializers';
import middlewares from './middleware';
import { Context, User, RequestorType } from '../types/types';
import { authDirectiveTransformer } from './schemas/directives';

// const formatResponse = (response, query: any) => {
//   if (response.data)
//     response.data = {
//       ...response.data,
//       ...getSerializer(query.operationName, response.data),
//     };
//   return response;
// };

const context = async ({ req }): Promise<Context> => {
  const privileged = req.requestor?.data?.requestorType === 'internalUser';
  const user = req.requestor?.data;

  return {
    user,
    headers: req.headers,
    token: req.headers.authorization,
    privileged,
  };
};

export const getGraphqlSchema = async (): Promise<any> => {
  const { typeDefs, resolvers } = await getSchema();
  const schema = authDirectiveTransformer(buildFederatedSchema({ typeDefs, resolvers }));
  const schemaWithMiddleware = applyMiddleware(schema, ...middlewares);

  return {
    schema: schemaWithMiddleware,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    // formatResponse,
    context,
    middleware: [],
  };
};
