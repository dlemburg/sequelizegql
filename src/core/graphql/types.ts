import { ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';

const mapTypes = (attributes, options) =>
  Object.entries(attributes)
    .map(([key, value]) => {
      return `${key}: ${mapSequelizeToGraphql(value, options)}`;
    })
    .join(' \n ');

export const typeGql = () => 'type';
export const inputGql = () => 'input';

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
