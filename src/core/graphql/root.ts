export const rootGql = () => `
  type Query {
    _dummyQuery: Int
  }

  type Mutation {
    _dummyMutation: Int
  }

  scalar JSON
`;