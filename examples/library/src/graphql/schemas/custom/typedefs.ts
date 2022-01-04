import { gql } from 'apollo-server-express';

const HealthTypedefs = gql`
  extend type Query {
    health: HealthResponse
  }

  type HealthResponse {
    ok: Boolean!
    date: String!
  }
`;

export default HealthTypedefs;
