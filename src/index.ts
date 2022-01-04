import fs from 'fs';
import gql from 'graphql-tag';
import merge from 'lodash/merge';
import { typeDefs as DateTypedefs, resolvers as DateResolvers } from 'graphql-scalars';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { DocumentNode } from 'graphql';
import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize';
import { Enums, InitializationOptions, Models, SchemaMap } from './types';
import { buildCustomSchema } from './util/build-schema-util';
import { getModels } from './util/model-util';

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
  options?: InitializationOptions;
};

export const buildGql = (value) =>
  gql`
    ${value}
  `;

const JSONResolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
class SequelizeGraphql {
  private resolvers;
  private typedefs: string;

  public async schema({
    models: inputModels = {} as Models,
    sequelize = {} as Sequelize,
    enums = {} as Enums,
    schemaMap = {} as SchemaMap,
    options = {} as InitializationOptions,
  }: InitializeInput): Promise<InitializeResponse> {
    const models = options.pathToModels ? await getModels(options.pathToModels) : inputModels;

    StateFactory({ enums, models, sequelize });

    const { typedefs, resolvers } = buildSchema(models, enums, schemaMap);

    this.typedefs = typedefs + buildRootTypedefs(options);
    this.resolvers = resolvers;

    if (options?.pathToCustomSchema) {
      const customSchema = await buildCustomSchema({
        models,
        pathToCustomSchema: options?.pathToCustomSchema,
      });

      const typedefs = mergeTypeDefs([
        ...DateTypedefs,
        buildGql(this.typedefs),
        ...customSchema.typedefs,
      ]);

      const resolvers = merge(JSONResolvers, DateResolvers, this.resolvers, customSchema.resolvers);

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
    const output = 'export const typedefsString =' + '`' + this.typedefs + '`;';

    fs.writeFileSync(filepath || `${__dirname}/generated-typedefs.js`, output, 'utf-8');
  }
}

export default SequelizeGraphql;
