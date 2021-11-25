import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize/types';
import { EnumMap, InitializationOptions, ModelMap, ResolverOptions, SchemaMap } from './types';

export type InitializeResponse = {
  typedefs: string;
  resolvers: any;
};

export type InitializeInput = {
  sequelize: Sequelize;
  enums?: EnumMap;
  models?: ModelMap;
  schemaMap?: SchemaMap;
  options?: ResolverOptions & InitializationOptions;
};

export const initialize = ({
  enums = {},
  models,
  sequelize,
  schemaMap = {},
  options = {},
}: InitializeInput): InitializeResponse => {
  StateFactory({ enums, models, sequelize });

  const { typedefs, resolvers } = buildSchema(models, enums, { schemaMap, options });
  const generatedGql = typedefs + buildRootTypedefs(options);

  return { typedefs: generatedGql, resolvers };
};
