import { EXAMPLE_INITIALIZATION_OPTIONS } from '../graphql/example-entities/example-initialization-input-options';
import { getSchema } from '../graphql/schemas';
import { init } from '../orm/sequelize';
import { typedefsString as importsTypedefsString } from './snapshots/imports-typedefs-string';
import { typedefsString as pathsTypedefsString } from './snapshots/paths-typedefs-string';

jest.setTimeout(30000);

const setup = async () => {
  return init();
};

const removeAllWhitespace = (str: string) => str.replaceAll(/\s/g, '');

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] `pathOnly` should return a graphql schema', async () => {
    await setup();

    const result = await getSchema(EXAMPLE_INITIALIZATION_OPTIONS.pathOnlyTest);

    expect(removeAllWhitespace(result.typedefsString)).toEqual(
      removeAllWhitespace(pathsTypedefsString)
    );
  });

  test('[getSchema] `imports` should return a graphql schema', async () => {
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
