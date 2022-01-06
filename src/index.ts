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
import { InitializationOptions, SchemaMap } from './types';
import { buildCustomSchema } from './util/build-schema-util';
import { getExports } from './util/export-util';

export type InitializeResponse = {
  typedefs: DocumentNode;
  resolvers: any;
  typedefsString: string;
};

export type InitializeInput = {
  sequelize?: Sequelize;
  enums?: any; // Enums;
  models?: any; // Models;
  schemaMap?: SchemaMap;
} & InitializationOptions;

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
    models: inputModels = {},
    enums: inputEmums = {},
    sequelize: inputSequelize = {} as any,
    schemaMap: inputSchemaMap = {} as SchemaMap,
    ...options
  }: InitializeInput): Promise<InitializeResponse> {
    const modelsExport = options.pathToModels ? await getExports(options.pathToModels) : inputModels;
    const enumsExport = options.pathToEnums ? await getExports(options.pathToEnums) : inputEmums;
    const schemaMapExport = options.pathToSchemaMap
      ? await getExports(options.pathToSchemaMap)
      : { schemaMap: inputSchemaMap };
    const sequelizeExport = options.pathToSequelize
      ? await getExports(options.pathToSequelize)
      : { sequelize: inputSequelize };

    StateFactory({
      models: modelsExport,
      enums: enumsExport,
      sequelize: sequelizeExport?.sequelize ?? sequelizeExport?.default,
    });

    const { typedefs, resolvers } = buildSchema(
      models,
      enums,
      schemaMapExport?.schemaMap ?? schemaMapExport?.default
    );

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
