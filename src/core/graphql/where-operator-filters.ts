import {
  OPERATORS_FILTERS_MAP,
  TOP_LEVEL_OPERATORS_GQL_MAP,
} from '../mappers/sequelize-gql-operators-map';
import { newLine } from './new-line';
import Constants from '../constants';

export const whereOperatorFiltersInputGql = (name, whereInputName, whereAttributes, options) => {
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
        ${whereAttributes.map((x) => `${x.key}: ${filterOperatorMapInputName}`)}
      }
    `,
    whereInputFilterFields: `
      ${topLevelOperatorsInput}
      ${options?.fieldMappers?.FILTERS || Constants.FILTERS}: ${filterInputName}
    `,
  };
};
