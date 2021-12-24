import { queryGql } from '../graphql';
import { BaseInput } from '../../types';
import { BaseGql } from './base-gql';

class Query extends BaseGql {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public gql(): string {
    const operations = this.getOperations('query');

    const result = queryGql(operations);

    return result;
  }
}

export const QueryFactory = (input: BaseInput) => new Query(input);
