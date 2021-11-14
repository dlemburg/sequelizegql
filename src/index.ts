import BaseService from './services/base-service';
import { buildEnums } from './util/array-util';
import { buildRootTypedefs } from './typedefs/root-typedefs';
import { buildSchema, generateEnumsGql } from './core';
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

  const { typedefs, resolvers } = buildSchema(models, { schemaMap, baseDirective });
  const enumGql = generateEnumsGql(buildEnums(enums));
  const generatedGql = typedefs + enumGql + buildRootTypedefs(options);

  return { BaseService, typedefs: generatedGql, resolvers };
};
