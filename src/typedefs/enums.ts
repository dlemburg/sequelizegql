import { getEnums } from '../state';
import { buildEnums } from '../util/array-util';
import { generateEnumsGql } from '../core';

const result = generateEnumsGql(buildEnums(getEnums()));

const BaseEnums = `
  ${result}
`;

export default BaseEnums;
