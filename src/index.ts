import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { loadEnums } from './state/enums';
import { loadModels } from './state/models';
import { loadSequelize } from './state/sequelize';

export const initialize = ({
  enums,
  models,
  sequelize,
  schemaMap = {},
  options = {},
  baseDirective,
}) => {
  if (enums) loadEnums(enums);
  if (models) loadModels(models);
  if (sequelize) loadSequelize(sequelize);

  const { typedefs, resolvers } = buildSchema(models, enums, { schemaMap, baseDirective });
  const generatedGql = typedefs + buildRootTypedefs(options);

  return { typedefs: generatedGql, resolvers };
};
