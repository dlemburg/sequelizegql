export const whereInput = (name, whereAttributes) =>
  `
  input ${name}WhereInput {
    ${whereAttributes.map((x) => `${x.key}: ${x.value}`).join('\n')}
  }
`;
