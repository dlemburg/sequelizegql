export const queryGql = (operations) => `
  extend type Query {
    ${operations}
  }
`;
