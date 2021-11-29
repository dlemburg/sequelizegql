import { gql } from 'apollo-server-express';

const HealthTypedefs = gql`
  extend type Query {
    customerHealth: [Int]
  }

  type HealthResponse {
    ok: Boolean!
    date: String!
  }
`;

export default HealthTypedefs;
