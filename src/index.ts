import fs from 'fs';
import gql from 'graphql-tag';
import merge from 'lodash/merge';
import { typeDefs as DateTypedefs, resolvers as DateResolvers } from 'graphql-scalars';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode } from 'graphql';
import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize/types';
import {
  EnumMap,
  Enums,
  ModelMap,
  Models,
  Resolver,
  SchemaMap,
  SchemaMapResolverOptions,
} from './types';
import { buildCustomSchema } from './util/build-schema-util';

export type InitializeResponse = {
  typedefs: DocumentNode;
  resolvers: any;
  typedefsString: string;
};

export type InitializeInput = {
  sequelize: Sequelize;
  enums?: Enums;
  models?: Models;
  schemaMap?: SchemaMap;
  options?: SchemaMapResolverOptions;
};

export const buildGql = (value) =>
  gql`
    ${value}
  `;

class SequelizeGraphql {
  private resolvers;
  private typedefs: string;

  public initialize({
    models,
    sequelize,
    enums = {},
    schemaMap = {},
    options = {},
  }: InitializeInput): InitializeResponse {
    StateFactory({ enums, models, sequelize });

    const { typedefs, resolvers } = buildSchema(models, enums, { schemaMap, options });

    this.typedefs = typedefs + buildRootTypedefs(options);
    this.resolvers = resolvers;

    if (options?.customSchemaPath) {
      const customSchema = buildCustomSchema({
        models,
        customSchemaPath: options?.customSchemaPath,
      });

      const typedefs = mergeTypeDefs([
        ...DateTypedefs,
        buildGql(this.typedefs),
        ...customSchema.typedefs,
      ]);

      const resolvers = merge(DateResolvers, this.resolvers, customSchema.resolvers);

      return {
        typedefs,
        resolvers,
        typedefsString: this.typedefs,
      };
    }

    return {
      typedefs: buildGql(this.typedefs),
      resolvers: this.resolvers,
      typedefsString: this.typedefs,
    };
  }

  public printConsole() {
    console.log(this.typedefs);
  }

  public outputTypedefs(filepath?: string) {
    const output = `export const typedefsString = '${this.typedefs}'`;

    fs.writeFileSync(filepath || `${__dirname}/generated-typedefs.js`, output, 'utf-8');
  }
}

export default new SequelizeGraphql();
