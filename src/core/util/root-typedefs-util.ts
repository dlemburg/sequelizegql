import { InitializationOptions } from '../../types/types';
import { deleteOptionsGql } from '../graphql/delete-options';
import { deleteResponseGql } from '../graphql/delete-response';

export const buildRootTypedefs = (options: InitializationOptions) => {
  let rootTypedefs = '';

  if (options.deleteResponseGql) {
    rootTypedefs += deleteResponseGql(options.deleteResponseGql);
  }

  if (options.includeDeleteOptions !== false) {
    rootTypedefs += deleteOptionsGql();
  }

  return rootTypedefs;
};
