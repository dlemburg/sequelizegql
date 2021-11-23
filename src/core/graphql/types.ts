import { ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';
import { stringBuilder } from '../util/string-util';
import { newLine } from './new-line';

const mapTypes = (attributes, options) =>
  Object.entries(attributes)
    .map(([key, value]) => {
      return `${key}: ${mapSequelizeToGraphql(value, options)}`;
    })
    .join(` ${newLine()} `);

export const typeGql = () => 'type';
export const inputGql = () => 'input';

export const typeGqlUpper = () => 'Type';
export const inputGqlUpper = () => 'Input';

export const inputGqlBuilder = (name: string) => stringBuilder(name, inputGqlUpper());

export const updateInputGqlBuilder = (name: string) =>
  stringBuilder('Update', inputGqlBuilder(name));

export const typesGql = (
  gqlKeyword,
  name,
  { associations = {}, ...attributes } = {} as ModelAttributes
) => {
  const generateNullable = gqlKeyword !== inputGql();
  const result = `
    ${gqlKeyword} ${name} {
      ${mapTypes(attributes, { generateNullable })}
      ${mapTypes(associations, {
        generateNullable,
        suffix: gqlKeyword === inputGql() ? inputGql() : '',
      })}
    }
  `;

  return result;
};
