import { GeneratedResolverField } from '../../types';
import { lowercaseFirstLetter } from '../../util/general-util';

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
  };
};
