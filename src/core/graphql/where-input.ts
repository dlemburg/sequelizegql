import { inputGql } from './types';

export const whereInputGql = (name, whereAttributes) =>
  `
  ${inputGql()} ${name}WhereInput {
    ${whereAttributes.map((x) => `${x.key}: ${x.value}`).join('\n')}
  }
`;
