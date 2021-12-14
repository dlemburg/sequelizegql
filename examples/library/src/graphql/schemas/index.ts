import SequelizeGraphql from '../../../../../src';

import * as Enums from '../../orm/enums';
import * as Models from '../../orm/models';

export const getSchema = async () => {
  const graphqlSequelize = SequelizeGraphql.initialize({
    enums: Enums,
    models: Models,
  } as any);

  return {
    typeDefs: graphqlSequelize.typedefs,
    resolvers: graphqlSequelize.resolvers,
  };
};
