import { ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';
import { stringBuilder } from '../util/string-util';
import { newLine } from './new-line';
import { pagedGql } from './paged';
import { whereInputNameGql } from './where-input';

const mapFields = (attributes, options) =>
  Object.entries(attributes)
    .map(([key, value]) => {
      return `${key}: ${mapSequelizeToGraphql(value, options)}`;
    })
    .join(` ${newLine()} `);

const mapAssociationTypes = (name, attributes, options) =>
  Object.entries(attributes)
    .map(([key, value]) => {
      return `${key}(where: ${whereInputNameGql(name)}): ${mapSequelizeToGraphql(value, options)}`;
    })
    .join(`${newLine()}`);

export const typeGql = () => 'type';
export const inputGql = () => 'input';

export const typeGqlUpper = () => 'Type';
export const inputGqlUpper = () => 'Input';

export const inputNameGql = (name: string) => `${name}${inputGqlUpper()}`;

export const updateInputNameGql = (name: string) => stringBuilder('Update', inputNameGql(name));

export const typesGql = (
  gqlKeyword,
  name,
  { associations = {}, ...attributes } = {} as ModelAttributes
) => {
  const input = inputGql();
  const generateNullable = gqlKeyword !== input;
  const associationTypesGql =
    gqlKeyword === input
      ? mapFields(associations, {
          generateNullable,
          suffix: inputGqlUpper(),
        })
      : mapAssociationTypes(name, associations, {
          generateNullable,
          suffix: '',
        });

  const result = `
    ${gqlKeyword} ${name} {
      ${mapFields(attributes, { generateNullable })}
      ${associationTypesGql}
    }
  `;

  return result;
};

export const pagedTypeGql = (name) => `
  type ${pagedGql(name)} {
    entities: [${name}]
    totalCount: Int
  }
`;
