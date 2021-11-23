import { argsGql, mutationGql } from '../graphql';
import { BaseInput } from '../../types';
import { BaseClass } from './base-class';

class Mutation extends BaseClass {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public gql(): string {
    const operations = Object.entries(this.resolverMap).reduce((acc, [key, value]: any) => {
      const argsValue = argsGql(value.args);
      const resolverKey = value.key;

      const result = `${
        this.resolvers[resolverKey]?.generate !== false
          ? `${resolverKey}${argsValue}: ${value.returnType} ${
              this.resolvers[resolverKey]?.directive ?? this.options?.baseDirective ?? ''
            }`
          : ''
      }`;
      return acc + result + `\n`;
    }, '');

    return mutationGql(operations);
  }
}

export const MutationFactory = (input: BaseInput) => new Mutation(input);
