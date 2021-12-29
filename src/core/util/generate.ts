import { ResolverOptions } from '../../types';

export const maybeGenerate = (options: ResolverOptions, key: any) => {
  if (options?.[key]?.generate === false || options?.omitResolvers?.includes(key)) {
    return false;
  }

  return true;
};
