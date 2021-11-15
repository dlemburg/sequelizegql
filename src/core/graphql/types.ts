import { ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';

const mapTypes = (attributes, options) =>
  Object.entries(attributes)
    .map(([key, value]) => {
      return `${key}: ${mapSequelizeToGraphql(value, options)}`;
    })
    .join(' \n ');

export const typesGql = (
  gqlKeyword,
  name,
  { associations = {}, ...attributes } = {} as ModelAttributes
) => {
  const generateNullable = gqlKeyword !== 'input';
  const result = `
    ${gqlKeyword} ${name} {
      ${mapTypes(attributes, { generateNullable })}
      ${mapTypes(associations, {
        generateNullable,
        suffix: gqlKeyword === 'input' ? 'Input' : '',
      })}
    }
  `;

  return result;
};
