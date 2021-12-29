import pluralize from 'pluralize';
import { SchemaMapOptions } from '../../types';

export const maybePluralize = (options: SchemaMapOptions, value: string): string => {
  const result = options?.pluralize !== false ? pluralize(value) : value;

  return result;
};
