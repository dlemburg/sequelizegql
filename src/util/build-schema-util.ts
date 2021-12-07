import { merge } from 'lodash';

export const buildCustomSchema = ({ models: Models, customSchemaPath }) => {
  let result = { schemaMap: {}, resolvers: {}, typedefs: [] as any[] };

  for (let name of [...Object.keys(Models)]) {
    try {
      const exports = require(`${__dirname}/${customSchemaPath}/${name}`);

      if (exports?.default?.schemaMap || exports?.schemaMap) {
        result.schemaMap = merge(result.schemaMap, exports.schemaMap);
      }

      if (exports?.default?.resolvers || exports?.resolvers) {
        result.resolvers = merge(result.resolvers, exports.resolvers);
      }

      if (exports?.default?.typedefs || exports?.typedefs) {
        result.typedefs = [...result.typedefs, exports.typedefs];
      }
    } catch {}
  }

  return result;
};
