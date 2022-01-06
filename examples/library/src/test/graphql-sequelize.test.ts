import { EXAMPLE_INITIALIZATION_OPTIONS } from '../graphql/example-entities/example-initialization-input-options';
import { getSchema } from '../graphql/schemas';
import { init } from '../orm/sequelize';

jest.setTimeout(30000);

const setup = async () => {
  return init();
};

const pathOnlyExample = {
  pathToCustomSchema: '/examples/library/src/graphql/schemas/custom/index.ts',
  pathToModels: '/examples/library/src/orm/models/**/*',
  pathToEnums: '/examples/library/src/orm/enums.ts',
  pathToSequelize: '/examples/library/src/orm/sequelize.ts',
  pathToSchemaMap:
    '/examples/library/src/graphql/example-entities/example-schema-maps/schema-map.ts',
};

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] `pathOnly` should return a graphql schema', async () => {
    await setup();

    const result = await getSchema(pathOnlyExample);
    expect(result).toBeTruthy();
  });

  test('[getSchema] `imports` should return a graphql schema', async () => {
    const sequelize = await setup();

    const result = await getSchema({
      ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
      sequelize,
    });
    expect(result).toBeTruthy();
  });
});
