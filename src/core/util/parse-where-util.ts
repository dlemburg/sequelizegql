import {
  OPERATORS_FILTERS_MAP,
  TOP_LEVEL_OPERATORS_GQL_MAP,
} from '../mappers/sequelize-gql-operators-map';
import Constants from '../constants';
import { SchemaMapOptions } from '../../types';

const OPERATORS = { ...TOP_LEVEL_OPERATORS_GQL_MAP, ...OPERATORS_FILTERS_MAP };

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

export const parseWhere = (where: any, modelMapOptions: SchemaMapOptions) => {
  if (where === null || typeof where !== 'object') {
    return where;
  }

  const whereEntries = Object.entries(where ?? {});

  const filter = whereEntries.reduce((acc, [key, value]) => {
    const operator = OPERATORS[key];

    if (operator) {
      const { op, getValue } = operator?.();

      if (value !== null && typeof value === 'object') {
        let nestedWhere;

        if (Array.isArray(value)) {
          nestedWhere = [];
          for (let elementValue of value) {
            nestedWhere.push(parseWhere(elementValue, modelMapOptions));
          }
        } else {
          nestedWhere = parseWhere(value, modelMapOptions);
        }

        return { ...acc, [op]: nestedWhere };
      }

      return { ...acc, [op]: getValue(value) };
    }

    if (key === (modelMapOptions?.fieldNameMappers?.FILTERS || Constants.FILTERS)) {
      const filtersWhere = parseWhere(value, modelMapOptions);

      return { ...acc, ...filtersWhere };
    }

    if (typeof value === 'object' && value !== null) {
      return { ...acc, [key]: parseWhere(value, modelMapOptions) };
    }

    acc[key] = value;

    return acc;
  }, {});

  return filter;
};
