import {} from 'dns';
import { SchemaMapOptions } from '../../types';

export const maybeGenerate = (options: SchemaMapOptions | undefined, key: any) => {
  if (options?.resolvers?.[key]?.generate === false || options?.omitResolvers?.includes(key)) {
    return false;
  }

  return true;
};
