import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/options';
import { getSchema } from '../graphql/schemas';
import { setup } from './setup';
import { removeAllWhitespace } from './util/remove-whitespace';

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] validating modelMap.whereInputAttributes result', async () => {
    const { sequelize } = await setup();

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

  test('[getSchema] validating modelMap `all` queries generated result to be 1', async () => {
    const { sequelize } = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const numberOfAllQueries = removeAllWhitespace(result.typedefsString)?.match(/all/g)?.length;

    expect(numberOfAllQueries).toEqual(1);
  });

  test('[getSchema] validating modelMap `allBooks` query not generated', async () => {
    const { sequelize } = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const hasAllBooksQuery = removeAllWhitespace(result.typedefsString)?.includes('allBooks');

    expect(hasAllBooksQuery).toBeTruthy();
  });

  test('[getSchema] validating modelMap `authors` query not generated', async () => {
    const { sequelize } = await setup();
    const imports = EXAMPLE_INITIALIZATION_OPTIONS.imports;

    const result = await getSchema({
      ...imports,
      sequelize,
    });

    const hasAuthorsQuery = removeAllWhitespace(result.typedefsString)?.includes(
      removeAllWhitespace(`extend type Query {
        authorsPaged(where: AuthorWhereInput, options: OptionsInputPaged): AuthorPaged! 
      }`)
    );

    expect(hasAuthorsQuery).toBeTruthy();
  });

  test('[getSchema] validating modelMap no BookAuthor queries generated', async () => {
    const { sequelize } = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const bookAuthor = removeAllWhitespace(result.typedefsString)?.includes(
      'bookAuthor(where:BookAuthorWhereInput)'
    );

    const bookAuthors = removeAllWhitespace(result.typedefsString)?.includes(
      'bookAuthors(where:BookAuthorWhereInput)'
    );

    const allBookAuthors = removeAllWhitespace(result.typedefsString)?.includes('allBookAuthors:');

    const bookAuthorsPaged = removeAllWhitespace(result.typedefsString)?.includes(
      'bookAuthorsPaged(where:'
    );

    expect(bookAuthor).toBeFalsy();
    expect(bookAuthors).toBeFalsy();
    expect(allBookAuthors).toBeFalsy();
    expect(bookAuthorsPaged).toBeFalsy();
  });

  test('[getSchema] validating modelMap no BookAuthor mutations generated', async () => {
    const { sequelize } = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const createBookAuthor = removeAllWhitespace(result.typedefsString)?.includes(
      'createBookAuthor(input:'
    );

    const updateBookAuthor = removeAllWhitespace(result.typedefsString)?.includes(
      'updateBookAuthor(input:'
    );

    const upsertBookAuthor = removeAllWhitespace(result.typedefsString)?.includes(
      'upsertBookAuthor(input:'
    );

    const deleteBookAuthor = removeAllWhitespace(result.typedefsString)?.includes(
      'deleteBookAuthor('
    );

    expect(createBookAuthor).toBeFalsy();
    expect(updateBookAuthor).toBeFalsy();
    expect(upsertBookAuthor).toBeFalsy();
    expect(deleteBookAuthor).toBeFalsy();
  });

  test('[getSchema] validating modelMap `upsertBook` mutation not generated', async () => {
    const { sequelize } = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const upsertBook = removeAllWhitespace(result.typedefsString)?.includes('upsertBook(input:');

    expect(upsertBook).toBeFalsy();
  });

  test('[getSchema] validating modelMap `deleteCity` mutation not generated', async () => {
    const { sequelize } = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    const deleteCity = removeAllWhitespace(result.typedefsString)?.includes('deleteCity(');

    expect(deleteCity).toBeFalsy();
  });
});
