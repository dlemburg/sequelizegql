import { ResolverOptions } from '../../types';

export const doGenerate = (options: ResolverOptions, key: any) => {
  if (options?.resolvers?.[key]?.generate === false || options?.omitResolvers?.includes(key)) {
    return false;
  }

  return true;
};
