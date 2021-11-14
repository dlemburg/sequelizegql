import { getEnums } from '..';
import { buildEnums } from '../util/array-util';
import { generateEnumsGql } from '../core/util';

const result = generateEnumsGql(buildEnums(getEnums()));

const BaseEnums = `
  ${result}
`;

export default BaseEnums;
