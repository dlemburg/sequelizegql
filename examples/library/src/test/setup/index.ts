import { createTestClient } from 'apollo-server-integration-testing';
import { init as initDataLayer } from '../../orm/sequelize';
import { getGraphqlSchema } from '../../graphql';
import { startApolloServer } from '../../apollo-server';

jest.setTimeout(30000);

export const setupApolloServerTest = async () => {
  const graphqlSchema = await getGraphqlSchema();
  const apolloServer = await startApolloServer();
  const testClient = createTestClient({
    apolloServer,
  });
  return testClient;
};

export const setup = async () => {
  const sequelize = await initDataLayer();
  const testClient = await setupApolloServerTest();

  return {
    sequelize,
    testClient,
  };
};
