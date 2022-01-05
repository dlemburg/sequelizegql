import SequelizeGraphql from '../../../../../src';

// import * as Enums from '../../orm/enums';
// import * as Models from '../../orm/models';
// import { sequelize } from '../../orm/sequelize';
// import { schemaMap } from './schema-map';

export const getSchema = async () => {
  const graphqlSequelize = new SequelizeGraphql();
  const schema = await graphqlSequelize.schema({
    // enums: Enums,
    // models: Models,
    // sequelize,
    // schemaMap,
    pathToCustomSchema: '/src/graphql/schemas/custom/index.ts',
    pathToModels: '/src/orm/models/**/*',
    pathToEnums: '/src/orm/enums.ts',
    pathToSequelize: '/src/orm/sequelize.ts',
    pathToSchemaMap: '/src/graphql/schemas/schema-map.ts',
  });

  // graphqlSequelize.printConsole();
  // graphqlSequelize.outputTypedefs();

  return {
    typeDefs: schema.typedefs,
    resolvers: schema.resolvers,
  };
};
