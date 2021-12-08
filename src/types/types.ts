import { DataTypes, FindOptions, WhereOptions } from 'sequelize';

export const RESOLVER_MAP_KEYS = {
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
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  FIND_MANY = 'findMany',
  FIND_MANY_PAGED = 'findManyPaged',
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
  omitResolvers?: GeneratedResolverField[];
  onBeforeResolve?;
  onAfterResolve?;
  fieldMappers?: {
    FILTERS: string; // defaults 'FILTERS'
  };
};

export type InitializationOptions = {
  customSchemaPath?: string;
  deleteResponseGql?: boolean;
  includeDeleteOptions?: boolean;
  onBeforeEveryResolve?;
  onAfterEveryResolve?;
};

export type SchemaMapResolverOptions = InitializationOptions &
  Omit<ResolverOptions, 'generate' | 'onBeforeResolve' | 'onAfterResolve'>;

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

export type EnumMap = Record<string, string>;

export type ModelMap = Record<string, any>;

export type ResolverFieldMapArgs = { [key: string]: string }[];

// TODO: 'Property in keyof Type' instead of '[key: string]'
export type ResolverFieldMap<Type> = {
  [key: string]: {
    operationType: 'query' | 'mutation';
    name: string;
    args: ResolverFieldMapArgs;
    returnType: string;
    key: GeneratedResolverField;
  };
};

export type KeyValuePairsResponse = {
  key: string;
  value: string;
};
