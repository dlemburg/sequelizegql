import { argsGql, queryGql } from '../graphql';
import { BaseInput } from '../../types';
import { BaseClass } from './base-class';

class Query extends BaseClass {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public gql(): string {
    const operations = Object.entries(this.resolverMap).reduce((acc, [key, value]: any) => {
      const argsValue = argsGql(value.args);
      const result = `${
        this.resolvers[value.name]?.generate !== false
          ? `${value.name}${argsValue}: ${value.returnType} ${
              this.resolvers[value.name]?.directive ?? this.options?.baseDirective ?? ''
            }`
          : ''
      }`;

      return acc + result + `\n`;
    }, '');

    return queryGql(operations);
  }
}

export const QueryFactory = (input: BaseInput) => new Query(input);
