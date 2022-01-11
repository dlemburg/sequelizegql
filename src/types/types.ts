import { DataTypes, FindOptions, Model, Sequelize, WhereOptions } from 'sequelize';
import { DocumentNode } from 'graphql';

export type DeleteResponse = { id: number; deletedCount: number };

export type DeleteOptions = { force: boolean };

type ModelName = string;

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

export type ExportMatcherFn = (exports: Record<any, any>) => Record<any, any>;

export type InitializeInput = {
  sequelize?: Sequelize;
  modelMap?: SchemaMap;
  rootMap?: SchemaMapOptions;
  deleteResponseGql?: string;
  includeDeleteOptions?: boolean;
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

export type Attribute = {
  sequelizeType: typeof DataTypes;
  type: string;
  isArray: boolean;
  isEnum: boolean;
  allowNull: boolean;
  values: string[];
};

export type KeyedAttribute = {
  [key: string]: Attribute;
};

export type ModelAttribute = KeyedAttribute & {
  associations?: KeyedAttribute;
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

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type InitializeResponse = {
  typedefs: DocumentNode;
  resolvers: any;
  typedefsString: string;
};
