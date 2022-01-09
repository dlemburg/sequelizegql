import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/example-initialization-input-options';
import { getSchema } from '../graphql/schemas';
import { setup } from './setup';
import { typedefsString as importsTypedefsString } from './snapshots/imports-typedefs-string';
import { typedefsString as pathsTypedefsString } from './snapshots/paths-typedefs-string';
import { removeAllWhitespace } from './util/remove-whitespace';

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] `pathOnly` options should return a graphql schema typedefs matching `paths-typedefs-string`', async () => {
    await setup();

    const result = await getSchema(EXAMPLE_INITIALIZATION_OPTIONS.pathOnlyTest);

    expect(removeAllWhitespace(result.typedefsString)).toEqual(
      removeAllWhitespace(pathsTypedefsString)
    );
  });

  test('[getSchema] `imports` options should return a graphql schema typedefs matching `imports-typedefs-string`', async () => {
    const sequelize = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });

    expect(removeAllWhitespace(result.typedefsString)).toEqual(
      removeAllWhitespace(importsTypedefsString)
    );
  });
});
