import { newLine } from '../graphql/new-line';

export const generateEnumsGql = (enums) => {
  return Object.entries(enums).reduce((acc, [key, value]: any) => {
    const enumGql = `
      enum ${key} {
        ${value.values.join(` ${newLine()} `)}
      }
    `;
    return acc + enumGql;
  }, '');
};
