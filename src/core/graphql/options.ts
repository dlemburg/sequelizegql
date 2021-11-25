export const optionsQueryInputGql = () => `OptionsInput`;

export const optionsQueryGql = `
 input ${optionsQueryInputGql()} {
  offset: Int
  limit: Int
 }
`;
