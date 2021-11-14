import { BaseServiceInterface } from './base-service';

export enum GeneratedResolverField {
  CREATE_MUTATION = 'create',
  UPDATE_MUTATION = 'update',
  DELETE_MUTATION = 'delete',
  UPSERT_MUTATION = 'upsert',
  FIND_ALL = 'all',
  FIND_ALL_WITH_ASSOCIATIONS = 'allWithAssociations',
  FIND_ONE = 'one',
  FIND_MANY = 'many',
  FIND_ONE_WITH_ASSOCIATIONS = 'oneWithAssociations',
  FIND_MANY_WITH_ASSOCIATIONS = 'manyWithAssociations',
}

export type Resolver = {
  [key: string]: { generate?: boolean; auth?: string };
};

export type BuildQueryMutation = {
  name: string;
  resolvers?: Resolver;
};

export enum BaseWhereInputType {
  STRING = 'String!',
  NUMBER = 'Int!',
}

export type BaseOptions = { whereAttributes?: string[]; baseDirective?: string };

export type BaseInput = {
  name?: string;
  model: any;
  options?: BaseOptions;
};

export type BaseTypedefInput = BaseInput & {
  resolvers?: Resolver;
};

export type InitializationOptions = {
  includeRootTypedefs?: boolean;
  includeQueryDefinition?: boolean;
  includeMutationDefinition?: boolean;
  includeDeleteResponse?: boolean;
  includeDeleteOptions?: boolean;
};
