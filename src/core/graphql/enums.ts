import { newLine } from './new-line';
import { Attribute } from '../../types';

export const generateEnumsGql = (enums: Attribute[]) => {
  return enums.reduce((acc, x: Attribute) => {
    const enumGql = `
      enum ${x.type} {
        ${x.values?.join(`${newLine()}`)}
      }
    `;
    return acc + enumGql;
  }, '');
};
