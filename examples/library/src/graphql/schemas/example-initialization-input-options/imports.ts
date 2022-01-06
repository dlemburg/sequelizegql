import * as Enums from '../../../orm/enums';
import * as Models from '../../../orm/models';
import { sequelize } from '../../../orm/sequelize';
import { schemaMap } from '../example-schema-maps/schema-map';

export const imports = {
  enums: Enums,
  models: Models,
  sequelize,
  schemaMap,
};
