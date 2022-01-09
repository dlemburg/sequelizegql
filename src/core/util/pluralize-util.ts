import pluralize from 'pluralize';
import { SchemaMapOptions } from '../../types';

export const maybePluralize = (value: string, options: SchemaMapOptions): string => {
  const result = pluralize(value);

  return result;
};
