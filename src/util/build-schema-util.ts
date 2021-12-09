import { merge } from 'lodash';
import { DocumentNode } from 'graphql';
import { ResolverOptions, SchemaMap } from '../types';

type CustomSchema = {
  schemaMap: SchemaMap;
  resolvers: ResolverOptions;
  typedefs: DocumentNode[];
};

type BuildCustomSchemaInput = {
  models: any;
  customSchemaPath: string;
};

export const buildCustomSchema = ({
  models: Models,
  customSchemaPath,
}: BuildCustomSchemaInput): CustomSchema => {
  let result: CustomSchema = { schemaMap: {}, resolvers: {}, typedefs: [] };

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
