import { createTestClient } from 'apollo-server-integration-testing';
import { init as initDataLayer } from '../../orm/sequelize';
import { startApolloServer } from '../../apollo-server';

jest.setTimeout(30000);

export const setup = async () => {
  const sequelize = await initDataLayer();
  const apolloServer = await startApolloServer({
    sequelize,
  });
  const testClient = createTestClient({
    apolloServer,
  });

  return {
    sequelize,
    testClient,
  };
};
