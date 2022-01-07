import fs from 'fs';
import merge from 'lodash/merge';
import { typeDefs as DateTypedefs, resolvers as DateResolvers } from 'graphql-scalars';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize';
import { InitializeInput, InitializeResponse, SchemaMap } from './types';
import { getExports } from './util/export-util';
import { validateInput } from './util/validate-input-util';
import { buildGql } from './util/gql-util';

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
      models: inputModels = {},
      enums: inputEmums = {},
      sequelize: inputSequelize = {} as Sequelize,
      schemaMap: inputSchemaMap = {} as SchemaMap,
      customSchema: inputCustomSchema = {} as SchemaMap,
      ...options
    } = input;

    const modelsPreExport = options.pathToModels
      ? await getExports(options.pathToModels, options.modelsExportMatcher)
      : inputModels;
    const enumsPreExport = options.pathToEnums
      ? await getExports(options.pathToEnums, options.enumsExportMatcher)
      : inputEmums;
    const schemaMapPreExport = options.pathToSchemaMap
      ? await getExports(options.pathToSchemaMap, options.schemaMapExportMatcher)
      : inputSchemaMap;
    const sequelizePreExport = options.pathToSequelize
      ? await getExports(options.pathToSequelize, options.sequelizeExportMatcher)
      : inputSequelize;
    const customSchemaPreExport = options.pathToCustomSchema
      ? await getExports(options.pathToCustomSchema, options.customSchemaExportMatcher)
      : inputCustomSchema;

    const modelsExport = modelsPreExport.models ?? modelsPreExport;
    const enumsExport = enumsPreExport.enums ?? enumsPreExport;
    const schemaMapExport = schemaMapPreExport.schemaMap ?? schemaMapPreExport;
    const sequelizeExport = sequelizePreExport.sequelize ?? sequelizePreExport;
    const customSchemaExport = customSchemaPreExport.customSchema ?? customSchemaPreExport;

    StateFactory({
      models: modelsExport,
      enums: enumsExport,
      sequelize: sequelizeExport,
    });

    const { typedefs, resolvers } = buildSchema(modelsExport, enumsExport, schemaMapExport);

    this.typedefs = typedefs + buildRootTypedefs(options);
    this.resolvers = resolvers;

    if (customSchemaExport) {
      const typedefs = mergeTypeDefs([
        ...DateTypedefs,
        buildGql(this.typedefs),
        ...customSchemaExport.typedefs,
      ]);

      const resolvers = merge(
        JSONResolvers,
        DateResolvers,
        this.resolvers,
        customSchemaExport.resolvers
      );

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
