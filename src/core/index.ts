import merge from 'lodash/merge';
import { SchemaMap, ResolverOptions, ModelMap, EnumMap } from '../types';
import { buildEnums } from '../util/array-util';
import { ResolverFactory, TypedefFactory } from './classes';
import { generateEnumsGql } from './graphql/enums';
import { optionsQueryGql } from './graphql/options';

type BuildSchemaOptions = {
  schemaMap?: SchemaMap;
  options?: ResolverOptions;
};

type BuildSchemaResponse = {
  typedefs: string;
  resolvers: any;
};

const STARTER_ACC: BuildSchemaResponse = { typedefs: '', resolvers: {} };

export const buildSchema = (
  models: ModelMap | undefined,
  enums: EnumMap | undefined,
  schemaOptions: BuildSchemaOptions
): BuildSchemaResponse => {
  const enumGql = generateEnumsGql(buildEnums(enums));
  const orderGql = optionsQueryGql();
  const result: any = Object.values(models as any).reduce(
    (acc: BuildSchemaResponse, model: any): BuildSchemaResponse => {
      const modelOverrides = schemaOptions?.schemaMap?.[model.name];
      const options: any = { ...schemaOptions?.options, ...modelOverrides?.options };

      if (options?.generate === false) return acc;

      const { generatedGql } = TypedefFactory({
        model,
        options,
      }).typedefMap();
      const resolvers = ResolverFactory({ model, options }).resolvers();

      acc.typedefs = acc.typedefs + generatedGql;
      acc.resolvers = merge(acc.resolvers, resolvers);

      return acc;
    },
    STARTER_ACC
  );

  result.typedefs = result.typedefs + enumGql + orderGql;

  return result;
};
