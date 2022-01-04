import { getPaths } from './glob-util';

export const getExports = async (path: string) => {
  const paths = await getPaths(path);

  if (!paths?.length) {
    throw new Error(`No entities found - ${path}!`);
  }

  const result = paths.reduce((acc: any, x: string) => {
    const exports = require(x);

    return { ...acc, ...exports };
  }, {});

  return result;
};
