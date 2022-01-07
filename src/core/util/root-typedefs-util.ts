import { InitializeInput } from '../../types';
import { dateGql } from '../graphql/date';
import { deleteOptionsGql } from '../graphql/delete-options';
import { deleteResponseGql } from '../graphql/delete-response';
import { rootGql } from '../graphql/root';

export const buildRootTypedefs = (options: InitializeInput) => {
  let rootTypedefs = deleteResponseGql(options.deleteResponseGql) + dateGql() + rootGql();

  if (options.includeDeleteOptions !== false) {
    rootTypedefs += deleteOptionsGql();
  }

  return rootTypedefs;
};
