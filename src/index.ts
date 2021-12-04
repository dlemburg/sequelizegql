import fs from 'fs';
import { buildRootTypedefs } from './core/util/root-typedefs-util';
import { buildSchema } from './core';
import { StateFactory } from './core/classes/state';
import { Sequelize } from 'sequelize/types';
import { EnumMap, ModelMap, SchemaMap, SchemaMapResolverOptions } from './types';

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

    // TODO: custom schema utility work
    // if ()
    // const customSchema = await buildSchema({ models: Models, customSchemaPath: options?.customSchemaPath });
    // const graphqlSequelize = GraphqlSequelize.initialize({
    //   enums: Enums,
    //   models: Models,
    //   baseDirective: INTERNAL_USER_AUTH,
    //   schemaMap: customSchema.schemaMap,
    // } as any);

    // const typeDefs = mergeTypeDefs([
    //   authDirectiveTypeDefs,
    //   buildGql(graphqlSequelize.typedefs),
    //   ...DateTypedefs,
    //   ...customSchema.typedefs,
    // ]);

    // const resolvers = merge(DateResolvers, graphqlSequelize.resolvers, customSchema.resolvers);

    // return {
    //   typeDefs,
    //   resolvers,
    // };

    return { typedefs: this.typedefs, resolvers: this.resolvers };
  }

  public printConsole() {
    console.log(this.typedefs);
  }

  public outputTypedefs(filepath?: string) {
    const output = `export const typedefsString = ${this.typedefs}`;

    fs.writeFileSync(filepath || `${__dirname}/generated-typedefs.js`, output, 'utf-8');
  }
}

export default new SequelizeGraphql();
