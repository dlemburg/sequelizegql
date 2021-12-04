import { merge } from 'lodash';

export const buildSchema = async ({ models: Models, customSchemaPath }) => {
  let result = { schemaMap: {}, resolvers: {}, typedefs: [] as any[] };

  for (let name of [...Object.keys(Models), 'Health', 'Lookups', 'Customer']) {
    try {
      const exports = await import(`${__dirname}/${customSchemaPath}/${name}`);

      if (exports?.schemaMap) {
        result.schemaMap = merge(result.schemaMap, exports?.schemaMap);
      }

      if (exports?.resolvers) {
        result.resolvers = merge(result.resolvers, exports?.resolvers);
      }

      if (exports?.typedefs) {
        result.typedefs = [...result.typedefs, exports?.typedefs];
      }
    } catch {}
  }

  return result;
};
