export const queryGraphql = (operations) => `
  extend type Mutation {
    ${operations}
  }
`;
