import {
  GeneratedResolverField,
  SchemaMap,
  SEQUELIZE_GRAPHQL_NAMESPACE,
} from '../../../../../../src/types';

export const schemaMap: SchemaMap = {
  [SEQUELIZE_GRAPHQL_NAMESPACE.root]: {
    resolvers: {
      findAll: { generate: false },
    },
    omitResolvers: [GeneratedResolverField.FIND_ONE],
    omitInputAttributes: ['createdAt', 'updatedAt', 'removedAt'],
    whereInputAttributes: ['id'],
    fieldNameMappers: {
      FILTERS: 'MY_FOO_FILTERS_NAME',
    },
  },
  author: {
    whereInputAttributes: ['id', 'name', 'surname'],
    resolvers: {
      findMany: { generate: false },
    },
  },
  Book: {
    resolvers: {
      findAll: { generate: true },
    },
    omitResolvers: [GeneratedResolverField.FIND_ONE],
  },
  BookAuthor: {
    generate: false,
  },
  City: {
    omitResolvers: [GeneratedResolverField.FIND_ONE],
  },
};
