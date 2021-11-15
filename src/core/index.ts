import merge from 'lodash/merge';
import { buildEnums } from '../util/array-util';
import { ResolverFactory, TypedefFactory } from './classes';
import { generateEnumsGql } from './util/enum-util';

export const buildSchema = (models, enums, { schemaMap, baseDirective }) => {
  const enumGql = generateEnumsGql(buildEnums(enums));
  const result: any = Object.values(models as any).reduce(
    (acc: any, model: any): any => {
      const overrides = schemaMap?.[model.name] ?? {};

      if (overrides?.generate === false) return acc;

      const { generatedGql } = TypedefFactory({
        model,
        ...overrides,
        options: { ...overrides?.options, baseDirective },
      }).typedefMap();
      const resolvers = ResolverFactory({ model }).resolvers();

      acc.typedefs = acc.typedefs + generatedGql;
      acc.resolvers = merge(acc.resolvers, resolvers);

      return acc;
    },
    { typedefs: '', resolvers: {} } as any
  );

  result.typedefs = result.typedefs + enumGql;

  return result;
};
