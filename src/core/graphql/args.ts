import { ResolverFieldMapArgs } from '../../types';

export const argsGql = (args: ResolverFieldMapArgs): string =>
  args.length
    ? `(${args
        .map((x) => {
          const [value] = Object.entries(x);
          return `${value[0]}: ${value[1]}`;
        })
        .join(', ')})`
    : '';
