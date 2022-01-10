import fs from 'fs';
import merge from 'lodash/merge';
import { typeDefs as DateTypedefs, resolvers as DateResolvers } from 'graphql-scalars';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { buildRootTypedefs, getExports, validateInput, buildGql } from './core/util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize';
import { InitializeInput, InitializeResponse, SchemaMap, SchemaMapOptions } from './types';
import { newLine } from './core/graphql';

const JSONResolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};

class SequelizeGraphql {
  private resolvers;
  private typedefs: string;

  public async schema(input: InitializeInput): Promise<InitializeResponse> {
    validateInput(input);

    const {
      sequelize = {} as Sequelize,
      modelMap = {} as SchemaMap,
      rootSchemaMap = {} as SchemaMapOptions,
      ...options
    } = input;

    const modelMapPreExport = options.pathToSchemaMap
      ? await getExports(options.pathToSchemaMap, options.modelMapExportMatcher)
      : modelMap;
    const sequelizePreExport = options.pathToSequelize
      ? await getExports(options.pathToSequelize, options.sequelizeExportMatcher)
      : sequelize;

    const modelMapExport = modelMapPreExport.modelMap ?? modelMapPreExport;
    const sequelizeExport = sequelizePreExport.sequelize ?? sequelizePreExport;

    StateFactory({
      sequelize: sequelizeExport,
    });

    const { typedefs, resolvers } = buildSchema(
      sequelizeExport.models,
      modelMapExport,
      rootSchemaMap
    );

    this.typedefs = typedefs + buildRootTypedefs(options);
    this.resolvers = resolvers;

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
    const output = 'export const typedefsString =' + ' `' + newLine() + this.typedefs + '`;';

    fs.writeFileSync(filepath || `${__dirname}/generated-typedefs.js`, output, 'utf-8');
  }
}

export default SequelizeGraphql;
