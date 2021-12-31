import { KeyValuePairs, SchemaMapOptions } from '../../types';
import { newLine } from './new-line';
import { inputGql } from './types';
import { whereOperatorFiltersInputGql } from './where-operator-filters';

export const whereInputNameGql = (name) => `${name}WhereInput`;

export const whereInputGql = (
  name: string,
  whereInputAttributes: KeyValuePairs[],
  schemaMapOptions: SchemaMapOptions
): string => {
  const whereInputName = whereInputNameGql(name);

  const { gql: operatorsGql, whereInputFilterFields } = whereOperatorFiltersInputGql(
    name,
    whereInputName,
    whereInputAttributes,
    schemaMapOptions
  );

  const whereInputAttributesFieldsGql = whereInputAttributes
    .map((x) => `${x.key}: ${x.value}`)
    .join(`${newLine()}`);

  return `
    ${inputGql()} ${whereInputName} {
      ${whereInputAttributesFieldsGql}
      ${whereInputFilterFields}
    }

    ${operatorsGql}
  `;
};
