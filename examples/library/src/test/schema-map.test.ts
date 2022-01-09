import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/example-initialization-input-options';
import { getSchema } from '../graphql/schemas';
import { setup } from './setup';
import { removeAllWhitespace } from './util/remove-whitespace';

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] validating schemaMap.whereInputAttributes result', async () => {
    const sequelize = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const authorWhereInputs = removeAllWhitespace(result.typedefsString).includes(
      removeAllWhitespace(`input  AuthorWhereInput {
            id: Int
            name: String
            surname: String
            AND: [AuthorWhereInput]
            OR: [AuthorWhereInput]
            FILTERS: AuthorWhereFilterInput
          }`)
    );

    expect(authorWhereInputs).toBeTruthy();
  });

  test('[getSchema] validating schemaMap `all` queries generated result to be 1', async () => {
    const sequelize = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const numberOfAllQueries = removeAllWhitespace(result.typedefsString)?.match(/all/g)?.length;

    expect(numberOfAllQueries).toEqual(1);
  });

  test('[getSchema] validating schemaMap `allBooks` query not generated', async () => {
    const sequelize = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const hasAllBooksQuery = removeAllWhitespace(result.typedefsString)?.includes('allBooks');

    expect(hasAllBooksQuery).toBeTruthy();
  });

  test('[getSchema] validating schemaMap `authors` query not generated', async () => {
    const sequelize = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const hasAuthorsQuery = removeAllWhitespace(result.typedefsString)?.includes(
      'authors(where:AuthorWhereInput)'
    );

    expect(hasAuthorsQuery).toBeFalsy();
  });
});
