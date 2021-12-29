import { queryGql } from '../graphql';

class Query {
  constructor() {
    return this;
  }

  public gql(operations): string {
    const result = queryGql(operations);

    return result;
  }
}

export const QueryFactory = () => new Query();
