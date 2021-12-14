import { gql } from 'apollo-server-express';

const HealthTypedefs = gql`
  extend type Query {
    health: [Int]
  }

  type HealthResponse {
    ok: Boolean!
    date: String!
  }
`;

export default HealthTypedefs;
