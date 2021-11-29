import { merge } from 'lodash';
import { typeDefs as DateTypedefs, resolvers as DateResolvers } from 'graphql-scalars';
import { mergeTypeDefs } from '@graphql-tools/merge';
import SequelizeGraphql from '../../../../../src';
// import { authDirectiveTypeDefs } from '@untitled-labs/backend-common/lib/graphql/directives/auth-directive';

import * as Enums from '../../orm/enums';
import * as Models from '../../orm/models';
import { buildGql, buildSchema } from './util';

export const INTERNAL_USER_AUTH = `@auth(acl: ["internalUser"])`;
export const USER_AUTH = `@auth(acl: ["user"])`;

export const getSchema = async () => {
  const customSchema = await buildSchema({ models: Models });
  const graphqlSequelize = SequelizeGraphql.initialize({
    enums: Enums,
    models: Models,
    baseDirective: INTERNAL_USER_AUTH,
    schemaMap: customSchema.schemaMap,
  } as any);

  const typeDefs = mergeTypeDefs([
    // authDirectiveTypeDefs,
    buildGql(graphqlSequelize.typedefs),
    ...DateTypedefs,
    ...customSchema.typedefs,
  ]);

  const resolvers = merge(DateResolvers, graphqlSequelize.resolvers, customSchema.resolvers);

  return {
    typeDefs,
    resolvers,
  };
};
