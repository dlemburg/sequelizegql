import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import { Enums, SchemaMap, SchemaMapOptions } from '../types';
import { buildEnums, lowercaseFirstLetter } from './util';
import { ResolverFactory, TypedefFactory } from './classes';
import { generateEnumsGql } from './graphql/enums';
import { optionsQueryGql } from './graphql/options';

type ResolverResponse = { Query?: Record<any, any>; Mutation?: Record<any, any> };

type BuildSchemaResponse = {
  typedefs: string;
  resolvers: ResolverResponse;
};

const findModelOverrides = (schemaMap: SchemaMap, model): SchemaMapOptions => {
  const loweredName = lowercaseFirstLetter(model.name);
  const modelOverrides = schemaMap?.[model.name] || schemaMap?.[loweredName] || {};

  return modelOverrides;
};

export const buildSchema = (
  models: any,
  enums: Enums | undefined,
  schemaMap: SchemaMap = {},
  rootSchemaMap: SchemaMapOptions
): BuildSchemaResponse => {
  const enumGql = generateEnumsGql(buildEnums(enums));
  const orderGql = optionsQueryGql();
  const modelsArr = Object.values(models as any).sort(
    (a: any, b: any) => a?.tableName - b?.tableName
  );

  const result: any = modelsArr.reduce(
    (acc: BuildSchemaResponse, model: any): BuildSchemaResponse => {
      const root = cloneDeep(rootSchemaMap);
      const options = merge(root, findModelOverrides(schemaMap, model));

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

  result.typedefs = result.typedefs + enumGql + orderGql;

  return result;
};
