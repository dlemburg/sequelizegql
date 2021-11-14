export const mutationGraphql = (operations) => `
  extend type Mutation {
    ${operations}
  }
`;
