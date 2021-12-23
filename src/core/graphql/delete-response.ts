export const deleteResponseGql = (deleteResponseGql?: string) =>
  deleteResponseGql ||
  `
  type DeleteResponse {
    id: JSON
  }
`;
