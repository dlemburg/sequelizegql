import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/example-initialization-input-options';
import { getSchema } from '../graphql/schemas';
import { setup } from './setup';
import { removeAllWhitespace } from './util/remove-whitespace';

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] validating schemaMap result', async () => {
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

    // TODO more checks

    expect(authorWhereInputs).toBeTruthy();
  });
});
