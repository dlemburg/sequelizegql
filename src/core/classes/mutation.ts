import { mutationGql } from '../graphql';

class Mutation {
  constructor() {
    return this;
  }

  public gql(operations): string {
    const result = mutationGql(operations);

    return result;
  }
}

export const MutationFactory = () => new Mutation();
