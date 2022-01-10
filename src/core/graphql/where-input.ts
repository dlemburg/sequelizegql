import { KeyValuePairs, SchemaMapOptions } from '../../types';
import { newLine } from './new-line';
import { tab } from './tab';
import { inputGql } from './types';
import { whereOperatorFiltersInputGql } from './where-operator-filters';

export const whereInputNameGql = (name) => `${name}WhereInput`;

export const whereInputGql = (
  name: string,
  whereInputAttributes: KeyValuePairs[],
  modelMapOptions: SchemaMapOptions
): string => {
  const whereInputName = whereInputNameGql(name);

  const { gql: operatorsGql, whereInputFilterFields } = whereOperatorFiltersInputGql(
    name,
    whereInputName,
    whereInputAttributes,
    modelMapOptions
  );

  const whereInputAttributesFieldsGql = whereInputAttributes
    .map((x) => `${x.key}: ${x.value}`)
    .join(`${newLine()}${tab()}`);

  return `
    ${inputGql()} ${whereInputName} {
      ${whereInputAttributesFieldsGql}
      ${whereInputFilterFields}
    }

    ${operatorsGql}
  `;
};
