import { newLine } from './new-line';
import { inputGql } from './types';
import { whereOperatorFiltersInputGql } from './where-operator-filters';

export const whereInputGql = (name, whereAttributes, options) => {
  const whereInputName = `${name}WhereInput`;

  const { gql: operatorsGql, whereInputFilterFields } = whereOperatorFiltersInputGql(
    name,
    whereInputName,
    whereAttributes,
    options
  );

  const whereAttributesFieldsGql = whereAttributes
    .map((x) => `${x.key}: ${x.value}`)
    .join(`${newLine()}`);

  return `
    ${inputGql()} ${whereInputName} {
      ${whereAttributesFieldsGql}
      ${whereInputFilterFields}
    }

    ${operatorsGql}
  `;
};
