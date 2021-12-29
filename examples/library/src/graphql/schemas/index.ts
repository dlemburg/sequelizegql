import SequelizeGraphql from '../../../../../src';
import { GeneratedResolverField } from '../../../../../src/types';

import * as Enums from '../../orm/enums';
import * as Models from '../../orm/models';

const schemaMap = {
  BookAuthor: {
    resolvers: {
      [GeneratedResolverField.CREATE_MUTATION]: { generate: false },
    },
  },
};

export const getSchema = async () => {
  const graphqlSequelize = SequelizeGraphql.initialize({
    enums: Enums,
    models: Models,
    schemaMap,
  } as any);

  return {
    typeDefs: graphqlSequelize.typedefs,
    resolvers: graphqlSequelize.resolvers,
  };
};
