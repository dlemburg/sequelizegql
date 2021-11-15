export const mutationGql = (operations) => `
  extend type Mutation {
    ${operations}
  }
`;
