import { GeneratedResolverField } from '../../types';
import { getResolverFieldMap } from '../mappers';
import { OperationArgsBuilder } from '../objects';
import { buildFakerData } from './faker-util';

const buildNonArrayAttributes = (attributes) =>
  Object.entries(attributes)
    .filter(([key, value]: any) => {
      return !value?.isArray;
    })
    .map(([key]) => key);

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
