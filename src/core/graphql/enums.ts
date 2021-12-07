import { buildEnums } from '../../util/enum-util';
import { StateFactory } from '../classes/state';
import { newLine } from './new-line';

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

const enumsGql = () => {
  const enums = StateFactory().getEnums();

  return `
  ${generateEnumsGql(buildEnums(enums))}
`;
};

export default enumsGql;
