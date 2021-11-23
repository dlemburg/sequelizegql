import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';

export const initialize = ({ enums, models, sequelize, schemaMap = {}, options = {} }) => {
  StateFactory({ enums, models, sequelize });

  const { typedefs, resolvers } = buildSchema(models, enums, { schemaMap, options });
  const generatedGql = typedefs + buildRootTypedefs(options);

  return { typedefs: generatedGql, resolvers };
};
