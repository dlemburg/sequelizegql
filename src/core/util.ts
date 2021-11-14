import faker from 'faker';
import merge from 'lodash/merge';
import { ResolverFactory } from '../factories/resolver-factory';
import { TypedefFactory } from '../factories/typedef-factory';
import { GeneratedResolverField } from '../types';
import { SEQUELIZE_GRAPHQL_TYPE_MAP, getResolverFieldMap } from './mappers';
import { OperationArgsBuilder } from './objects/operation-args';

export const OMIT_ATTRIBUTES = ['id', 'createdAt', 'updatedAt', 'removedAt'];

const buildNonArrayAttributes = (attributes) =>
  Object.entries(attributes)
    .filter(([key, value]: any) => {
      return !value?.isArray;
    })
    .map(([key]) => key);

const buildFakerData = (data) => {
  return Object.entries(data).reduce((acc, [key, typeInfo]: any) => {
    // TODO: this should be improved
    if (['ARRAY', 'ENUM', 'ASSOCIATION'].includes(typeInfo.sequelizeType)) return acc;

    const fakerType = SEQUELIZE_GRAPHQL_TYPE_MAP[typeInfo.sequelizeType]?.();
    const value = faker.datatype?.[fakerType]?.();

    return { ...acc, ...(value && { [key]: value }) };
  }, {});
};

export const buildTests = ({
  name,
  attributes,
  inputAttributes,
  resolvers = {} as any,
  variables = {} as any,
}) => {
  const resolverMap = getResolverFieldMap(name);

  const operations = Object.entries(resolverMap).reduce((acc, [key, value]) => {
    const { args, name, operationType, pickedReturnAttributes, key: resolverKey } = value as any;

    if (resolvers[name]?.generate === false) return acc;

    const returnAttributes = buildNonArrayAttributes(inputAttributes);
    const bodyRaw = `${value.name}${args(value.args)} { ${
      resolverKey === GeneratedResolverField.DELETE_MUTATION
        ? ['id']
        : [...returnAttributes, ...pickedReturnAttributes].join('\n')
    } }`;

    const vars = args.reduce((acc, x) => {
      const field = Object.keys(x)[0];
      const value =
        field === 'input'
          ? {
              ...buildFakerData(inputAttributes),
              ...variables[field],
              ...resolvers?.[name]?.variables,
              data: { monitor: true },
            }
          : variables[field];

      return { ...acc, [field]: value };
    }, {} as any);

    const { operationNameArgs, operationArgs } = OperationArgsBuilder(value.args);
    const body = `
      ${operationType} ${name}Monitor${operationNameArgs} {
        ${name}${operationArgs} { ${
      resolverKey === GeneratedResolverField.DELETE_MUTATION
        ? ['id']
        : [...returnAttributes, ...pickedReturnAttributes].join('\n')
    } }
      }
    `;

    const result = {
      operationType,
      name,
      body,
      bodyRaw,
      variables: vars,
      key,
    };

    return [...acc, result];
  }, []);

  return operations;
};

export const buildSchema = (models, { schemaMap, baseDirective }) => {
  const result: any = Object.values(models as any).reduce(
    (acc: any, model: any): any => {
      const overrides = schemaMap?.[model.name] ?? {};

      if (overrides?.generate === false) return acc;

      const { generatedGql } = TypedefFactory({
        model,
        ...overrides,
        options: { ...overrides?.options, baseDirective },
      });
      const resolvers = ResolverFactory({ model });

      acc.typedefs = acc.typedefs + generatedGql;
      acc.resolvers = merge(acc.resolvers, resolvers);

      return acc;
    },
    { typedefs: '', resolvers: {} } as any
  );

  return result;
};
