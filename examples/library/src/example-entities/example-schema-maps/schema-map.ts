import { GeneratedResolverField, SchemaMap } from '../../../../../src/types';

export const rootSchemaMap = {
  resolvers: {
    findAll: { generate: false },
  },
  omitResolvers: [GeneratedResolverField.FIND_ONE],
  omitInputAttributes: ['createdAt', 'updatedAt', 'removedAt'],
  whereInputAttributes: ['id'],
};

export const schemaMap: SchemaMap = {
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
    omitResolvers: [GeneratedResolverField.UPSERT_MUTATION],
  },
  BookAuthor: {
    generate: false,
  },
  City: {
    omitResolvers: [GeneratedResolverField.DELETE_MUTATION],
  },
};
