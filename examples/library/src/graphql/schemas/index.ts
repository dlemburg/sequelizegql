import SequelizeGraphql from '../../../../../src';
import {
  SchemaMap,
  SEQUELIZE_GRAPHQL_NAMESPACE,
  GeneratedResolverField,
} from '../../../../../src/types';

import * as Enums from '../../orm/enums';
// import * as Models from '../../orm/models';
import { sequelize } from '../../orm/sequelize';

const schemaMap: SchemaMap = {
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

export const getSchema = async () => {
  const graphqlSequelize = new SequelizeGraphql();
  const schema = await graphqlSequelize.schema({
    enums: Enums as any,
    // models: Models as any,
    sequelize,
    schemaMap,
    options: {
      pathToCustomSchema: '/src/graphql/schemas/custom/index.ts',
      pathToModels: '/src/orm/models/**/*',
    },
  });

  // graphqlSequelize.printConsole();
  // graphqlSequelize.outputTypedefs();

  return {
    typeDefs: schema.typedefs,
    resolvers: schema.resolvers,
  };
};
