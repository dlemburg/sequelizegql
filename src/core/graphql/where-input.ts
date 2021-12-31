import { KeyValuePairs, SchemaMapOptions } from '../../types';
import { newLine } from './new-line';
import { inputGql } from './types';
import { whereOperatorFiltersInputGql } from './where-operator-filters';

export const whereInputNameGql = (name) => `${name}WhereInput`;

export const whereInputGql = (
  name: string,
  whereAttributes: KeyValuePairs[],
  schemaMapOptions: SchemaMapOptions
): string => {
  const whereInputName = whereInputNameGql(name);

  const { gql: operatorsGql, whereInputFilterFields } = whereOperatorFiltersInputGql(
    name,
    whereInputName,
    whereAttributes,
    schemaMapOptions
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
