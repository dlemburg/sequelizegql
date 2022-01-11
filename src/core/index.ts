import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { SchemaMap, SchemaMapOptions } from '../types';
import { lowercaseFirstLetter } from './util';
import { ResolverFactory, TypedefFactory } from './classes';
import { optionsQueryGql } from './graphql/options';

type ResolverResponse = { Query?: Record<any, any>; Mutation?: Record<any, any> };

type BuildSchemaResponse = {
  typedefs: string;
  resolvers: ResolverResponse;
};

const findModelOverrides = (modelMap: SchemaMap, model): SchemaMapOptions => {
  const loweredName = lowercaseFirstLetter(model.name);
  const modelOverrides = modelMap?.[model.name] || modelMap?.[loweredName] || {};

  return modelOverrides;
};

export const buildSchema = (
  models: any,
  modelMap: SchemaMap = {},
  rootMap: SchemaMapOptions
): BuildSchemaResponse => {
  const modelsArr = Object.values(models as any).sort(
    (a: any, b: any) => a?.tableName - b?.tableName
  );

  const result: any = modelsArr.reduce(
    (acc: BuildSchemaResponse, model: any): BuildSchemaResponse => {
      const root = cloneDeep(rootMap);
      const options = merge(root, findModelOverrides(modelMap, model));

      if (options?.generate === false) return acc;

      const { generatedGql } = TypedefFactory({
        model,
        options,
      }).typedefMap();
      const resolvers = ResolverFactory({ model, options }).resolversMap();

      acc.typedefs = acc.typedefs + generatedGql;
      acc.resolvers = merge(acc.resolvers, resolvers);

      return acc;
    },
    { typedefs: '', resolvers: {} }
  );

  result.typedefs = result.typedefs + optionsQueryGql();

  return result;
};
