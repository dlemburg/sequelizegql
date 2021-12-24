import { mutationGql } from '../graphql';
import { BaseInput } from '../../types';
import { BaseGql } from './base-gql';

class Mutation extends BaseGql {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public gql(): string {
    const operations = this.getOperations('mutation');

    const result = mutationGql(operations);

    return result;
  }
}

export const MutationFactory = (input: BaseInput) => new Mutation(input);
