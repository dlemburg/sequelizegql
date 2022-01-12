import fs from 'fs';
import merge from 'lodash/merge';
import { typeDefs as DateTypedefs, resolvers as DateResolvers } from 'graphql-scalars';
import { mergeTypeDefs } from '@graphql-tools/merge';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { buildRootTypedefs, validateInput, buildGql } from './core/util';
import { buildSchema } from './core';
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
  private sequelize: Sequelize;

  public async generateSchema(input: InitializeInput): Promise<InitializeResponse> {
    validateInput(input);

    this.sequelize = input.sequelize as Sequelize;

    const {
      sequelize = {} as Sequelize,
      modelMap = {} as SchemaMap,
      rootMap = {} as SchemaMapOptions,
      ...options
    } = input;

    const { typedefs, resolvers } = buildSchema(sequelize.models, modelMap, rootMap);

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

  public getSequelize() {
    return this.sequelize;
  }
}

let sequelizeGraphqlSingleton;

export default () => {
  if (sequelizeGraphqlSingleton) {
    return sequelizeGraphqlSingleton;
  }

  sequelizeGraphqlSingleton = new SequelizeGraphql();

  return sequelizeGraphqlSingleton;
};
