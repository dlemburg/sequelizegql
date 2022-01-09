import { merge } from 'lodash';
import { ExportMatcherFn } from '../../types';
import { getPaths } from './glob-util';

export const getExports = async (path: string, exportMatcherFn?: ExportMatcherFn) => {
  const paths = await getPaths(path);

  if (!paths?.length) {
    throw new Error(`No entities found - ${path}!`);
  }

  const result = paths.reduce((acc: any, x: string) => {
    const exports = require(x);
    const nextExports =
      Object.keys(exports)?.length === 1 && exports.default ? exports.default : exports;
    const result = exportMatcherFn?.(nextExports) ?? nextExports;

    return merge(acc, result);
  }, {});

  return result;
};
