import * as Enums from '../../orm/enums';
import * as Models from '../../orm/models';
import { rootSchemaMap, schemaMap } from '../example-schema-maps/schema-map';

export const imports = {
  enums: Enums,
  models: Models,
  schemaMap,
  rootSchemaMap,
};
