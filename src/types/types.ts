import { DataTypes, FindOptions, WhereOptions } from 'sequelize';

const RESOLVER_MAP_KEYS = {
  create: '',
  createMany: '',
  update: '',
  upsert: '',
  delete: '',
  all: '',
  findOne: '',
  findMany: '',
} as const;

export enum GeneratedResolverField {
  CREATE_MUTATION = 'create',
  CREATE_MANY_MUTATION = 'createMany',
  UPDATE_MUTATION = 'update',
  UPSERT_MUTATION = 'upsert',
  DELETE_MUTATION = 'delete',
  FIND_ALL = 'all',
  FIND_ONE = 'one',
  FIND_MANY = 'many',
}

export enum BaseWhereInputType {
  STRING = 'String!',
  NUMBER = 'Int!',
}

export type ResolverOptions = {
  generate?: boolean; // defaults true
  pluralize?: boolean; // defaults true
  directive?: string;
  whereAttributes?: string[];
  omitAttributes?: string[];
  omitResolvers?: string[];
  onBeforeResolve?;
  onBAfterResolve?;
};

export type SchemaMapResolverOptions = Omit<ResolverOptions, 'generate'>;

export type Resolver = {
  [key: string]: ResolverOptions;
};

type ResolverMap<Type> = {
  [Property in keyof Type]?: ResolverOptions;
};

export type SchemaMap = {
  [key: string]: {
    options?: ResolverOptions;
    resolvers: ResolverMap<typeof RESOLVER_MAP_KEYS>;
  };
};

export type BuildQueryMutation = {
  name: string;
  resolvers?: Resolver;
};

export type BaseInput<T = any> = {
  model: T;
  options?: ResolverOptions;
  resolvers?: Resolver;
};

export type InitializationOptions = {
  includeRootTypedefs?: boolean;
  includeQueryDefinition?: boolean;
  includeMutationDefinition?: boolean;
  includeDeleteResponse?: boolean;
  includeDeleteOptions?: boolean;
};

export type BaseAttributes = {
  [key: string]: {
    allowNull?: boolean;
    sequelizeType?: typeof DataTypes;
    type?: string;
  };
};

export type AssociationAttributes = {
  isArray?: boolean;
};

export type ModelAttributes = BaseAttributes & {
  associations?: BaseAttributes & AssociationAttributes;
};

export type BaseServiceFilter<T> = WhereOptions<T>;

export type BaseServiceOptions<T> = FindOptions<T>;

export type TestFactoryResolver = {
  [key: string]: { variables?: Record<string, any>; generate?: boolean };
};

export type BaseTestFactoryInput<T = any> = BaseInput<T> & {
  variables?: Record<string, any>;
  resolvers?: TestFactoryResolver;
};
