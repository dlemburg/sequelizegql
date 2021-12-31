import {
  OPERATORS_FILTERS_MAP,
  TOP_LEVEL_OPERATORS_GQL_MAP,
} from '../mappers/sequelize-gql-operators-map';
import Constants from '../constants';
import { ResolverOptions } from '../../types';

const buildWhereFilters = (entries) => {
  const whereFilters = Object.entries(entries).reduce((acc2, [key, value]: any) => {
    const ops = Object.entries(value).reduce((acc3, [opKey, opValue]: any) => {
      const filterOperatorResult = OPERATORS_FILTERS_MAP[opKey]?.();
      const { op, getValue } = filterOperatorResult;

      return { ...acc3, [op]: getValue(opValue) };
    }, {});

    acc2[key] = ops;

    return acc2;
  }, {});

  return whereFilters;
};

export const parseWhere = (where, resolverOptions: ResolverOptions) => {
  const whereEntries = Object.entries(where);

  if (!whereEntries?.length) return where;

  const filter = whereEntries.reduce((acc, [key, value]) => {
    const topLevelOperatorResult = TOP_LEVEL_OPERATORS_GQL_MAP[key]?.();

    if (topLevelOperatorResult) {
      const { op, getValue } = topLevelOperatorResult;

      return { ...acc, [op]: getValue(value) };
    }

    if (
      key === (resolverOptions?.fieldNameMappers?.FILTERS || Constants.FILTERS) &&
      Object.keys(whereEntries[key])?.length
    ) {
      const whereOperatorFilters = buildWhereFilters(whereEntries[key]);

      return { ...acc, ...whereOperatorFilters };
    }

    acc[key] = value;

    return acc;
  }, {});

  return filter;
};
