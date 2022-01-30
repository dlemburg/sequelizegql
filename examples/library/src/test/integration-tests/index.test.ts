import { setup } from '../setup';
import { allBooks } from './queries/Book';

describe('[index.test.ts] integration tests suite', () => {
  test('[getSchema] Book', async () => {
    const { query: allBooksQuery } = allBooks[0];
    const { testClient } = await setup();

    const response = await testClient.query(allBooksQuery);

    expect(response).toStrictEqual({ data: { allBooks: [] } });
  });
});
