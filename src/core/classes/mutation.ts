import { getResolverFieldMap } from '../mappers';
import { argsGraphql, mutationGraphql } from '../graphql';

class Mutation {
  private name;
  private resolvers;
  private options;
  private resolverMap;

  constructor({ name, resolvers = {}, options = {} as any }) {
    this.name = name;
    this.resolvers = resolvers;
    this.options = options;
    this.resolverMap = getResolverFieldMap(this.name);

    return this;
  }

  public gql() {
    const operations = Object.entries(this.resolverMap).reduce((acc, [key, value]: any) => {
      const argsValue = argsGraphql(value.args);

      const result = `${
        this.resolvers[value.name]?.generate !== false
          ? `${value.name}${argsValue}: ${value.returnType} ${
              this.resolvers[value.name]?.directive ?? this.options?.baseDirective ?? ''
            }`
          : ''
      }`;
      return acc + result + `\n`;
    }, '');

    return mutationGraphql(operations);
  }
}

export const MutationFactory = ({ name, resolvers = {}, options = {} as any }) =>
  new Mutation({ name, resolvers, options });
