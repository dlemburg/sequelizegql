import { generateEnumsGql } from '../util/enum-util';
import { getEnums } from '../../state';
import { buildEnums } from '../../util/array-util';

const enumsGql = () => `
  ${generateEnumsGql(buildEnums(getEnums()))}
`;

export default enumsGql;
