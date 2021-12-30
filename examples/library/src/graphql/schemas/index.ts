import SequelizeGraphql from '../../../../../src';
import { SchemaMap } from '../../../../../src/types';

import * as Enums from '../../orm/enums';
import * as Models from '../../orm/models';
import { sequelize } from '../../orm/sequelize';

const schemaMap: SchemaMap = {
  Author: {
    whereAttributes: ['id', 'name', 'surname'],
    resolvers: {
      findMany: { generate: false },
      findAll: { generate: false },
    },
  },
  Book: {
    resolvers: {
      findAll: { generate: false },
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
