import { getResolverFieldMap } from '../mappers';
import { argsGql, queryGql } from '../graphql';
import { BaseInput } from '../../types';
import { BaseService } from '../../services';

class Query {
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

    return queryGql(operations);
  }
}

export const QueryFactory = (input: BaseInput) => new Query(input);
