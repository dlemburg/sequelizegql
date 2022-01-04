import { getPaths } from './glob-util';

export const getModels = async (pathToModels: string) => {
  const paths = await getPaths(pathToModels);

  if (!paths?.length) {
    throw new Error('No models found!');
  }

  // if (paths.length === 1 && paths[0].includes('/index')) {
  // }

  const result = paths.reduce((acc: any, x: string) => {
    const exports = require(x);

    if (x.includes('/index')) {
      return acc;
    }

    return { ...acc, ...exports };
  }, {});

  return result;
};
