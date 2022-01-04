import { merge } from 'lodash';
import { DocumentNode } from 'graphql';
import { ResolverOptions } from '../types';
const glob = require('glob');

type CustomSchemaResponse = {
  resolvers: ResolverOptions;
  typedefs: DocumentNode[];
};

type CustomSchemaInput = {
  models;
  pathToCustomSchema: string;
};

const getDirectories = (src: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const path = process.cwd() + src;

    glob(path, (err, files) => {
      resolve(files);
    });
  });
};

const isValidCustomPath = (pathToCustomSchema: string, path: string, modelNames: string[]) => {
  if (isGlob(pathToCustomSchema)) {
    return (
      !(path.endsWith('/index.ts') || path.endsWith('/index.js')) &&
      !modelNames.find((x) => x.endsWith(`/${x}.ts`) || x.endsWith(`/${x}.ts`))
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
  const paths = await getDirectories(pathToCustomSchema); //  any file ending in index.ts or a modelName.ts

  for (let path of paths) {
    try {
      if (!isValidCustomPath(pathToCustomSchema, path, modelNames)) {
        continue;
      }

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
