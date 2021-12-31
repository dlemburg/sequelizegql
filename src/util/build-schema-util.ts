import { merge } from 'lodash';
import { DocumentNode } from 'graphql';
import { ResolverOptions } from '../types';

type CustomSchemaResponse = {
  resolvers: ResolverOptions;
  typedefs: DocumentNode[];
};

type CustomSchemaInput = {
  models;
  customSchemaPath: string;
};

export const buildCustomSchema = ({
  models: Models,
  customSchemaPath,
}: CustomSchemaInput): CustomSchemaResponse => {
  let result: CustomSchemaResponse = { resolvers: {}, typedefs: [] };

  for (let name of [...Object.keys(Models)]) {
    try {
      const exports = require(`${__dirname}/${customSchemaPath}/${name}`);

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
