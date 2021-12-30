import SequelizeGraphql from '../../../../../src';
import { SchemaMap, SEQUELIZE_GRAPHQL_NAMESPACE } from '../../../../../src/types';

import * as Enums from '../../orm/enums';
import * as Models from '../../orm/models';
import { sequelize } from '../../orm/sequelize';

const schemaMap: SchemaMap = {
  [SEQUELIZE_GRAPHQL_NAMESPACE.root]: {
    resolvers: {
      findAll: { generate: false },
    },
    whereAttributes: ['id'],
  },
  author: {
    whereAttributes: ['id', 'name', 'surname'],
    resolvers: {
      findMany: { generate: false },
    },
  },
  Book: {
    resolvers: {
      findAll: { generate: true },
    },
  },
  BookAuthor: {
    generate: false,
  },
};

export const getSchema = async () => {
  const graphqlSequelize = SequelizeGraphql.initialize({
    enums: Enums as any,
    models: Models as any,
    sequelize,
    schemaMap,
  });

  return {
    typeDefs: graphqlSequelize.typedefs,
    resolvers: graphqlSequelize.resolvers,
  };
};
