import { getSchema } from '../';
import { init } from '../../../orm/sequelize';

jest.setTimeout(30000);

beforeEach(async () => {
  await init();
});

describe('[graphql-sequelize.test.ts] suite', () => {
  test('[getSchema] should return a graphql schema', async () => {
    const result = await getSchema({
      pathToCustomSchema: '/examples/library/src/graphql/schemas/custom/index.ts',
      pathToModels: '/examples/library/src/orm/models/**/*',
      pathToEnums: '/examples/library/src/orm/enums.ts',
      pathToSequelize: '/examples/library/src/orm/sequelize.ts',
      pathToSchemaMap: '/examples/library/src/graphql/schemas/schema-map.ts',
    });
    expect(result).toBeTruthy();
  });
});
