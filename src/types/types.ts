import { DataTypes, FindOptions, Model, WhereOptions } from 'sequelize';

// TODO: refactor MAP_KEYS
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

export const RESOLVER_QUERY_MAP_KEYS = {
  all: '',
  findOne: '',
  findMany: '',
} as const;

export const RESOLVER_MUTATION_MAP_KEYS = {
  create: '',
  createMany: '',
  update: '',
  upsert: '',
  delete: '',
} as const;

export enum GeneratedResolverField {
  CREATE_MUTATION = 'create',
  CREATE_BULK_MUTATION = 'bulkCreate',
  UPDATE_MUTATION = 'update',
  UPSERT_MUTATION = 'upsert',
  DELETE_MUTATION = 'delete',
  FIND_ALL = 'findAll',
  FIND_ONE = 'findOne',
  FIND_MANY = 'findMany',
  FIND_MANY_PAGED = 'findManyPaged',
}

export type ResolverMap = {
  [Property in keyof GeneratedResolverField]?: ResolverOptions;
};

export type InitializationOptions = {
  customSchemaPath?: string;
  deleteResponseGql?: string;
  includeDeleteOptions?: boolean;
};

type BaseOptions = {
  generate?: boolean; // defaults true
  directive?: string;
  whereAttributes?: string[];
  omitResolvers?: GeneratedResolverField[];
  onBeforeResolve?;
  onAfterResolve?;
  fieldMappers?: {
    /* field mapping names */
    FILTERS: string; // defaults 'FILTERS'
  };
};

export type ResolverOptions = {
  omitAttributes?: string[];
} & BaseOptions;

type ModelName = string;

export type SchemaMapOptions = {
  pluralize?: boolean;
  resolvers?: ResolverMap;
} & BaseOptions;

export type SchemaMap = {
  [key: ModelName]: SchemaMapOptions; // defaults true
};

export type BuildQueryMutation = {
  name: string;
  resolvers?: ResolverMap;
};

export type BaseInput<T = any> = {
  model: T;
  options?: ResolverOptions;
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

export type KeyValuePairs = {
  key: string;
  value: string;
};

export type Models = { [key: string]: Model<any, any> };
export type Enums = { [key: string]: string };

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
