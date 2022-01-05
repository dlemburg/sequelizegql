import * as Enums from '../../../orm/enums';
import * as Models from '../../../orm/models';
import { sequelize } from '../../../orm/sequelize';
import { schemaMap } from '../example-schema-maps/schema-map';

export const EXAMPLES = {
  pathOnly: {
    pathToCustomSchema: '/src/graphql/schemas/custom/index.ts',
    pathToModels: '/src/orm/models/**/*',
    pathToEnums: '/src/orm/enums.ts',
    pathToSequelize: '/src/orm/sequelize.ts',
    pathToSchemaMap: '/src/graphql/schemas/example-schema-maps/schema-map.ts',
  },
  imports: {
    enums: Enums,
    models: Models,
    sequelize,
    schemaMap,
  },
};
