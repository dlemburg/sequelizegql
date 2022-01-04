import { DataTypes, FindOptions, Model, WhereOptions } from 'sequelize';

type ModelName = string;

export enum SEQUELIZE_GRAPHQL_NAMESPACE {
  root = 'SEQUELIZE_GRAPHQL_ROOT',
}

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
  create?: ResolverOptions;
  createMany?: ResolverOptions;
  update?: ResolverOptions;
  upsert?: ResolverOptions;
  delete?: ResolverOptions;
  findAll?: ResolverOptions;
  findOne?: ResolverOptions;
  findMany?: ResolverOptions;
};

export type InitializationOptions = {
  pathToCustomSchema?: string;
  pathToModels?: string;
  deleteResponseGql?: string;
  includeDeleteOptions?: boolean;
};

type BaseOptions = {
  generate?: boolean; // defaults true
  directive?: string;
  whereInputAttributes?: string[];
  omitResolvers?: GeneratedResolverField[];
  omitInputAttributes?: string[];
  onBeforeResolve?: (args) => Promise<void>;
  onAfterResolve?: (args) => Promise<void>;
  fieldNameMappers?: {
    FILTERS: string; // defaults to 'FILTERS'
  };
};

export type ResolverOptions = Omit<
  BaseOptions,
  'omitResolvers' | 'omitInputAttributes' | 'pluralize'
>;

export type SchemaMapOptions = BaseOptions & {
  resolvers?: ResolverMap;
};

type RootSchemaMap = { SEQUELIZE_GRAPHQL_ROOT?: SchemaMapOptions };

export type SchemaMap = {
  [key: ModelName]: SchemaMapOptions; // defaults true
} & RootSchemaMap;

export type BuildQueryMutation = {
  name: string;
  resolvers?: ResolverMap;
};

export type BaseInput<T = any> = {
  model: T;
  options?: SchemaMapOptions;
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

export type ResolverFieldMap = {
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
