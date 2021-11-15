export const whereInputGql = (name, whereAttributes) =>
  `
  input ${name}WhereInput {
    ${whereAttributes.map((x) => `${x.key}: ${x.value}`).join('\n')}
  }
`;
