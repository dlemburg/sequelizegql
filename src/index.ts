import BaseService from './base-service';
import { buildEnums } from './util/array-util';
import { buildRootTypedefs } from './root-typedefs';
import { buildSchema, generateEnumsGql } from './util';

// stateful
let Enums;
let Models;
let sequelize;

export const loadEnums = (enums) => {
  Enums = enums;
};
export const getEnums = () => Enums;

export const loadModels = (models) => {
  Models = models;
};
export const getModels = () => Models;

export const loadSequelize = (sequelizeInstance) => {
  sequelize = sequelizeInstance;
};
export const getSequelize = () => sequelize;

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
  const enumGql = generateEnumsGql(buildEnums(Enums));
  const generatedGql = typedefs + enumGql + buildRootTypedefs(options);

  return { BaseService, typedefs: generatedGql, resolvers };
};
