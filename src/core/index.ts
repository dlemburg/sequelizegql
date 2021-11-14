import merge from 'lodash/merge';
import { ResolverBuilder, TypedefBuilder } from './objects';

export const buildSchema = (models, { schemaMap, baseDirective }) => {
  const result: any = Object.values(models as any).reduce(
    (acc: any, model: any): any => {
      const overrides = schemaMap?.[model.name] ?? {};

      if (overrides?.generate === false) return acc;

      const { generatedGql } = TypedefBuilder({
        model,
        ...overrides,
        options: { ...overrides?.options, baseDirective },
      });
      const resolvers = ResolverBuilder({ model });

      acc.typedefs = acc.typedefs + generatedGql;
      acc.resolvers = merge(acc.resolvers, resolvers);

      return acc;
    },
    { typedefs: '', resolvers: {} } as any
  );

  return result;
};
