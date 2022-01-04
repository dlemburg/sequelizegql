import { merge } from 'lodash';
import { DocumentNode } from 'graphql';
import { ResolverOptions } from '../types';
import { getPaths } from './glob-util';

type CustomSchemaResponse = {
  resolvers: ResolverOptions;
  typedefs: DocumentNode[];
};

type CustomSchemaInput = {
  models;
  pathToCustomSchema: string;
};

//  any file ending in index.ts or a modelName.ts
const isValidCustomPath = (pathToCustomSchema: string, path: string, modelNames: string[]) => {
  if (isGlob(pathToCustomSchema)) {
    return (
      !(path.endsWith('/index.ts') || path.endsWith('/index.js')) &&
      !modelNames.find((x) => x.endsWith(`/${x}.ts`) || x.endsWith(`/${x}.js`))
    );
  }

  return true;
};

const isGlob = (path) => path.includes('/**/*');

export const buildCustomSchema = async ({
  models: Models,
  pathToCustomSchema,
}: CustomSchemaInput): Promise<CustomSchemaResponse> => {
  let result: CustomSchemaResponse = { resolvers: {}, typedefs: [] };
  const modelNames = [...Object.keys(Models)];
  const paths = await getPaths(pathToCustomSchema);

  for (let path of paths) {
    try {
      // if (!isValidCustomPath(pathToCustomSchema, path, modelNames)) {
      //   continue;
      // }

      const exports = require(path);

      if (exports?.default?.resolvers || exports?.resolvers) {
        result.resolvers = merge(result.resolvers, exports.resolvers);
      }

      if (exports?.default?.typedefs || exports?.typedefs) {
        result.typedefs = [...result.typedefs, exports.typedefs];
      }
    } catch (err) {
      console.log(err);
    }
  }

  return result;
};
