import fs from 'fs';
import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize/types';
import {
  EnumMap,
  InitializationOptions,
  ModelMap,
  SchemaMap,
  SchemaMapResolverOptions,
} from './types';

export type InitializeResponse = {
  typedefs: string;
  resolvers: any;
};

export type InitializeInput = {
  sequelize: Sequelize;
  enums?: EnumMap;
  models?: ModelMap;
  schemaMap?: SchemaMap;
  options?: SchemaMapResolverOptions;
};

class SequelizeGraphql {
  private resolvers;
  private typedefs: string;
  private options: InitializationOptions;

  public initialize({
    enums = {},
    models,
    sequelize,
    schemaMap = {},
    options = {},
  }: InitializeInput): InitializeResponse {
    StateFactory({ enums, models, sequelize });

    const { typedefs, resolvers } = buildSchema(models, enums, { schemaMap, options });

    this.typedefs = typedefs + buildRootTypedefs(options);
    this.resolvers = resolvers;
    this.options = options;

    return { typedefs: this.typedefs, resolvers: this.resolvers };
  }

  public printConsole() {
    console.log(this.typedefs);
  }

  public outputTypedefs(filepath?: string) {
    fs.writeFileSync(filepath || `${__dirname}/generated-typedefs.js`, this.typedefs, 'utf-8');
  }
}

export default new SequelizeGraphql();
