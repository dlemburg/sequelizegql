import { queryGql } from '../graphql';
import { BaseInput } from '../../types';
import { BaseGql } from './base-gql';

const generateGql = () => {};

class Query extends BaseGql {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public gql(): string {
    const operations = this.getOperations();

    return queryGql(operations);
  }
}

export const QueryFactory = (input: BaseInput) => new Query(input);
