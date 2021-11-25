import { TOP_LEVEL_OPERATORS_GQL_MAP } from '../mappers/sequelize-gql-operators-map';
import { newLine } from './new-line';
import { inputGql } from './types';
import { whereInputFilterEnumGql } from './where-attributes-input-filter-enum';

export const whereInputGql = (name, whereAttributes) => {
  const whereInputName = `${name}WhereInput`;
  const { enumGql, enumName } = whereInputFilterEnumGql(name, whereAttributes());

  const whereAttributeOperatorsGql = Object.entries(TOP_LEVEL_OPERATORS_GQL_MAP)
    .map(([opName, opFn]) => `${opName}: ${opFn(whereInputName).gql}`)
    .join(`${newLine()}`);

  const whereAttributesFieldsGql = whereAttributes
    .map((x) => `${x.key}: ${x.value}`)
    .join(`${newLine()}`);

  return `
    ${enumGql}

    ${inputGql()} ${whereInputName} {
      ${whereAttributesFieldsGql}
      ${whereAttributeOperatorsGql}
    }
  `;
};
