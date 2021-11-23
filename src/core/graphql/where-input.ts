import { newLine } from './new-line';
import { inputGql } from './types';

export const whereInputGql = (name, whereAttributes) =>
  `
  ${inputGql()} ${name}WhereInput {
    ${whereAttributes.map((x) => `${x.key}: ${x.value}`).join(` ${newLine()} `)}
  }
`;
