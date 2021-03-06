import {
  OPERATORS_FILTERS_MAP,
  TOP_LEVEL_OPERATORS_GQL_MAP,
} from '../mappers/sequelize-gql-operators-map';
import { newLine } from './new-line';
import Constants from '../constants';
import { KeyValuePairs, SchemaMapOptions } from '../../types';

export const whereOperatorFiltersInputGql = (
  name: string,
  whereInputName: string,
  whereInputAttributes: KeyValuePairs[],
  modelMapOptions: SchemaMapOptions
) => {
  const filterInputName = `${name}WhereFilterInput`;
  const filterOperatorMapInputName = `${name}WhereFilterOperatorMapInput`;

  const topLevelOperatorsInput = Object.entries(TOP_LEVEL_OPERATORS_GQL_MAP)
    .map(([opName, opFn]) => `${opName}: ${opFn(whereInputName).gql()}`)
    .join(`${newLine()}`);

  const filterOperatorsInput = Object.entries(OPERATORS_FILTERS_MAP)
    .map(([opName, opFn]) => `${opName}: ${opFn().gql()}`)
    .join(`${newLine()}`);

  return {
    gql: `
      input ${filterOperatorMapInputName} {
        ${filterOperatorsInput}
      }

      input ${filterInputName} {
        ${whereInputAttributes.map((x) => `${x.key}: ${filterOperatorMapInputName}`)}
      }
    `,
    whereInputFilterFields: `
      ${topLevelOperatorsInput}
      ${modelMapOptions?.fieldNameMappers?.FILTERS || Constants.FILTERS}: ${filterInputName}
    `,
  };
};
