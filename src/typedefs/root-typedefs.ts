import { InitializationOptions } from '../types/types';

const query = `
  type Query {
    _dummyQuery: Int
  }
`;

const mutation = `
  type Mutation {
    _dummyMutation: Int
  }
`;

const deleteResponse = `
  type DeleteResponse {
    id: String
  }
`;

const deleteOptions = `
  input DeleteOptions {
    force: Boolean
  }
`;

const RootTypedefs = query + mutation + deleteResponse + deleteOptions;

export const buildRootTypedefs = (options: InitializationOptions) => {
  if (options.includeRootTypedefs === false) return '';

  let rootTypedefs = '';

  if (options.includeQueryDefinition === true) {
    rootTypedefs += query;
  }

  if (options.includeMutationDefinition === true) {
    rootTypedefs += mutation;
  }

  if (options.includeDeleteResponse !== false) {
    rootTypedefs += deleteResponse;
  }

  if (options.includeDeleteOptions !== false) {
    rootTypedefs += deleteOptions;
  }

  return rootTypedefs;
};

export default RootTypedefs;
