import faker from 'faker';
import merge from 'lodash/merge';
import { ResolverFactory } from './resolver-factory';
import { TypedefFactory } from './typedef-factory';
import { ModelAttributes } from './base-service';
import { GeneratedResolverField } from './types';

export const OMIT_ATTRIBUTES = ['id', 'createdAt', 'updatedAt', 'removedAt'];

const SEQUELIZE_GRAPHQL_TYPE_MAP = {
  DECIMAL: () => 'Float',
  INTEGER: () => 'Int',
  STRING: () => 'String',
  TEXT: () => 'String',
  UUID: () => 'String',
  DATE: () => 'DateTime',
  JSONB: () => 'JSON',
  BOOLEAN: () => 'Boolean',
  ARRAY: (type, { isArray, suffix }) =>
    `[${SEQUELIZE_GRAPHQL_TYPE_MAP[type]?.() ?? type}${suffix ?? ''}]`,
  ENUM: (type) => SEQUELIZE_GRAPHQL_TYPE_MAP[type]?.() ?? type,
  ASSOCIATION: (type, { isArray, suffix }) =>
    isArray
      ? `[${SEQUELIZE_GRAPHQL_TYPE_MAP[type]?.() ?? type}${suffix ?? ''}]`
      : `${type}${suffix ?? ''}`,
};

const SEQUELIZE_FAKER_TYPE_MAP = {
  DECIMAL: () => 'number',
  INTEGER: () => 'number',
  STRING: () => 'string',
  UUID: () => 'uuid',
  DATE: () => 'datetime',
  JSONB: () => 'json',
  BOOLEAN: () => 'boolean',
  ARRAY: (type) => `array`,
  ENUM: (type) => null,
  ASSOCIATION: (type, isArray) => [],
};

export const getResolverFieldMap = (name) => {
  const loweredName = lowercaseFirstLetter(name);

  return {
    [GeneratedResolverField.CREATE_MUTATION]: {
      operationType: 'mutation',
      name: `create${name}`,
      args: [{ input: `${name}Input!` }],
      returnType: `${name}!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.CREATE_MUTATION,
    },
    [GeneratedResolverField.UPDATE_MUTATION]: {
      operationType: 'mutation',
      name: `update${name}`,
      args: [{ where: `${name}WhereInput!` }, { input: `Update${name}Input!` }],
      returnType: `${name}!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.UPDATE_MUTATION,
    },
    [GeneratedResolverField.DELETE_MUTATION]: {
      operationType: 'mutation',
      name: `delete${name}`,
      args: [{ where: `${name}WhereInput!` }, { options: 'DeleteOptions' }],
      returnType: `DeleteResponse`,
      pickedReturnAttributes: [],
      key: GeneratedResolverField.DELETE_MUTATION,
    },
    [GeneratedResolverField.UPSERT_MUTATION]: {
      operationType: 'mutation',
      name: `upsert${name}`,
      args: [{ where: `${name}WhereInput!` }, { input: `${name}Input!` }],
      returnType: `${name}!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.UPSERT_MUTATION,
    },
    [GeneratedResolverField.FIND_ALL]: {
      operationType: 'query',
      name: `all${name}s`,
      args: [],
      returnType: `[${name}]!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_ALL,
    },
    [GeneratedResolverField.FIND_ALL_WITH_ASSOCIATIONS]: {
      operationType: 'query',
      name: `all${name}sWithAssociations`,
      args: [],
      returnType: `[${name}]!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_ALL_WITH_ASSOCIATIONS,
    },
    [GeneratedResolverField.FIND_MANY]: {
      operationType: 'query',
      name: `${loweredName}s`,
      args: [{ where: `${name}WhereInput!` }],
      returnType: `[${name}]!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_MANY,
    },
    [GeneratedResolverField.FIND_ONE]: {
      operationType: 'query',
      name: `${loweredName}`,
      args: [{ where: `${name}WhereInput!` }],
      returnType: `${name}`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_ONE,
    },
    [GeneratedResolverField.FIND_ONE_WITH_ASSOCIATIONS]: {
      operationType: 'query',
      name: `${loweredName}WithAssociations`,
      args: [{ where: `${name}WhereInput!` }],
      returnType: `${name}`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_ONE_WITH_ASSOCIATIONS,
    },
    [GeneratedResolverField.FIND_MANY_WITH_ASSOCIATIONS]: {
      operationType: 'query',
      name: `${loweredName}sWithAssociations`,
      args: [{ where: `${name}WhereInput!` }],
      returnType: `[${name}]`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_MANY_WITH_ASSOCIATIONS,
    },
  };
};

const gql = String.raw;

export const generateEnumsGql = (enums) => {
  return Object.entries(enums).reduce((acc, [key, value]: any) => {
    const enumGql = `
      enum ${key} {
        ${value.values.join('\n')}
      }
    `;
    return acc + enumGql;
  }, '');
};

export const lowercaseFirstLetter = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

const buildNullable = (allowNull) => `${allowNull ? '' : '!'}`;

const mapSequelizeToGraphql = (
  { sequelizeType, type, allowNull, isArray }: any,
  { generateNullable = true, suffix = '' }
) => {
  const result = SEQUELIZE_GRAPHQL_TYPE_MAP[sequelizeType]?.(type, { isArray, suffix });

  if (!result) throw new Error(`Sequelize type <${sequelizeType} not mapped yet!`);

  return `${result}${generateNullable ? buildNullable(allowNull) : ''}`;
};

const mapTypes = (attributes, options) =>
  Object.entries(attributes)
    .map(([key, value]) => {
      return `${key}: ${mapSequelizeToGraphql(value, options)}`;
    })
    .join(' \n ');

export const buildGraphqlSequelizeMappings = (
  gqlKeyword,
  name,
  { associations = {}, ...attributes } = {} as ModelAttributes
) => {
  const generateNullable = gqlKeyword !== 'input';
  const result = `
        ${gqlKeyword} ${name} {
          ${mapTypes(attributes, { generateNullable })}
          ${mapTypes(associations, {
            generateNullable,
            suffix: gqlKeyword === 'input' ? 'Input' : '',
          })}
        }
      `;

  return result;
};

export const buildWhereAttributes = (whereAttributes, modelAttributes) => {
  const result = whereAttributes?.reduce((acc, x) => {
    if (modelAttributes[x]) {
      const value = mapSequelizeToGraphql(modelAttributes[x], { generateNullable: false });

      acc.push({ key: x, value });
    }

    return acc;
  }, []) ?? [
    { key: 'id', value: mapSequelizeToGraphql(modelAttributes['id'], { generateNullable: false }) },
  ];

  return result;
};

export const buildWhereInput = (name, whereAttributes) =>
  gql`
  input ${name}WhereInput {
    ${whereAttributes.map((x) => `${x.key}: ${x.value}`).join('\n')}
  }
`;
const buildArgs = (args) =>
  args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `${value[0]}: ${value[1]}`;
        })
        .join(', ')})`
    : '';

const buildArgsDecorated = (args) => {
  const operationNameArgs = args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `$${value[0]}: ${value[1]}`;
        })
        .join(', ')})`
    : '';

  const operationArgs = args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `${value[0]}: $${value[0]}`;
        })
        .join(', ')})`
    : '';

  return { operationNameArgs, operationArgs };
};

const buildTopLevelAttributes = (attributes) =>
  Object.entries(attributes)
    .filter(([key, value]: any) => {
      return !value?.isArray;
    })
    .map(([key]) => key);

const buildFakerData = (data) => {
  return Object.entries(data).reduce((acc, [key, typeInfo]: any) => {
    // TODO: this should be improved
    if (['ARRAY', 'ENUM', 'ASSOCIATION'].includes(typeInfo.sequelizeType)) return acc;

    const fakerType = SEQUELIZE_FAKER_TYPE_MAP[typeInfo.sequelizeType]?.();
    const value = faker.datatype?.[fakerType]?.();

    return { ...acc, ...(value && { [key]: value }) };
  }, {});
};

export const buildMutations = ({ name, resolvers = {}, options = {} as any }) => {
  const resolverMap = getResolverFieldMap(name);

  const operations = Object.entries(resolverMap).reduce((acc, [key, value]) => {
    const args = buildArgs(value.args);

    const result = `${
      resolvers[value.name]?.generate !== false
        ? `${value.name}${args}: ${value.returnType} ${
            resolvers[value.name]?.directive ?? options?.baseDirective ?? ''
          }`
        : ''
    }`;
    return acc + result + `\n`;
  }, '');

  return {
    mutationGql: `
      extend type Mutation {
        ${operations}
      }
    `,
  };
};

export const buildQuery = ({ name, resolvers = {}, options = {} as any }) => {
  const resolverMap = getResolverFieldMap(name);

  const operations = Object.entries(resolverMap).reduce((acc, [key, value]) => {
    const args = buildArgs(value.args);
    const result = `${
      resolvers[value.name]?.generate !== false
        ? `${value.name}${args}: ${value.returnType} ${
            resolvers[value.name]?.directive ?? options?.baseDirective ?? ''
          }`
        : ''
    }`;

    return acc + result + `\n`;
  }, '');

  return {
    queryGql: `
      extend type Query {
        ${operations}
      }
    `,
  };
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

    const returnAttributes = buildTopLevelAttributes(inputAttributes);
    const bodyRaw = `${value.name}${buildArgs(value.args)} { ${
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

    const { operationNameArgs, operationArgs } = buildArgsDecorated(value.args);
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
