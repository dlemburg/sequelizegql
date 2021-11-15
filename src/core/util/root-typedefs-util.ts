import { InitializationOptions } from '../../types/types';
import { defaultMutationGql } from '../graphql/default-mutation';
import { defaultQueryGql } from '../graphql/default-query';
import { deleteOptionsGql } from '../graphql/delete-options';
import { deleteResponseGql } from '../graphql/delete-response';

export const buildRootTypedefs = (options: InitializationOptions) => {
  if (options.includeRootTypedefs === false) return '';

  let rootTypedefs = '';

  if (options.includeQueryDefinition === true) {
    rootTypedefs += defaultQueryGql();
  }

  if (options.includeMutationDefinition === true) {
    rootTypedefs += defaultMutationGql;
  }

  if (options.includeDeleteResponse !== false) {
    rootTypedefs += deleteResponseGql();
  }

  if (options.includeDeleteOptions !== false) {
    rootTypedefs += deleteOptionsGql();
  }

  return rootTypedefs;
};
