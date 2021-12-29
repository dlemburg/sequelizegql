import merge from 'lodash/merge';
import { SchemaMap, ResolverOptions, Enums, Models } from '../types';
import { buildEnums } from '../util/enum-util';
import { ResolverFactory, TypedefFactory } from './classes';
import { generateEnumsGql } from './graphql/enums';
import { optionsQueryGql } from './graphql/options';

type BuildSchemaOptions = {
  schemaMap?: SchemaMap;
  options?: ResolverOptions;
};

type ResolverResponse = { Query?: Record<any, any>; Mutation?: Record<any, any> };

type BuildSchemaResponse = {
  typedefs: string;
  resolvers: ResolverResponse;
};

const STARTER_ACC: BuildSchemaResponse = { typedefs: '', resolvers: {} };

export const buildSchema = (
  models: Models | undefined,
  enums: Enums | undefined,
  schemaOptions: BuildSchemaOptions
): BuildSchemaResponse => {
  const enumGql = generateEnumsGql(buildEnums(enums));
  const orderGql = optionsQueryGql();
  const result: any = Object.values(models as any).reduce(
    (acc: BuildSchemaResponse, model: any): BuildSchemaResponse => {
      const modelOverrides = schemaOptions?.schemaMap?.[model.name];
      const options: ResolverOptions = { ...schemaOptions?.options, ...modelOverrides };

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
    STARTER_ACC
  );

  result.typedefs = result.typedefs + enumGql + orderGql;

  return result;
};
