export const deleteOptionsGql = (name = 'DeleteOptions') => `
  input ${name} {
    force: Boolean
  }
`;
