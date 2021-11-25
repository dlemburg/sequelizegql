import pluralize from 'pluralize';
import { GeneratedResolverField, ResolverOptions } from '../../types';
import { lowercaseFirstLetter } from '../../util/general-util';
import { optionsQueryInputGql } from '../graphql/options';

const sanitize = (value: string, options: ResolverOptions) => {
  const result = options?.pluralize !== false ? pluralize(value) : value;

  return result;
};

export const getResolverFieldMap = (name: string, options: ResolverOptions) => {
  const loweredName = lowercaseFirstLetter(name);
  const pluralizedName = sanitize(name, options);
  const pluralizedLoweredName = sanitize(loweredName, options);

  return {
    [GeneratedResolverField.FIND_ONE]: {
      operationType: 'query',
      name: `${loweredName}`,
      args: [{ where: `${name}WhereInput!` }, { options: optionsQueryInputGql() }],
      returnType: `${name}`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_ONE,
    },
    [GeneratedResolverField.FIND_MANY]: {
      operationType: 'query',
      name: `${pluralizedLoweredName}`,
      args: [{ where: `${name}WhereInput!` }, { options: optionsQueryInputGql() }],
      returnType: `[${name}]!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_MANY,
    },
    [GeneratedResolverField.FIND_ALL]: {
      operationType: 'query',
      name: `all${pluralizedName}`,
      args: [],
      returnType: `[${name}]!`,
      pickedReturnAttributes: ['id'],
      key: GeneratedResolverField.FIND_ALL,
    },
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
  };
};
