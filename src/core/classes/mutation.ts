import { getResolverFieldMap } from '../mappers';
import { argsGql, mutationGql } from '../graphql';
import { BaseService } from '../../services';
import { BaseInput } from '../../types';

class Mutation {
  private name;
  private resolvers;
  private options;
  private resolverMap;
  private service;

  constructor({ model, resolvers = {}, options = {} }: BaseInput) {
    this.service = BaseService(model);
    this.name = this.service.getModelName();
    this.resolvers = resolvers;
    this.options = options;
    this.resolverMap = getResolverFieldMap(this.name);

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

    return mutationGql(operations);
  }
}

export const MutationFactory = (input: BaseInput) => new Mutation(input);
