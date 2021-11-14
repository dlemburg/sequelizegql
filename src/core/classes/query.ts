import { getResolverFieldMap } from '../mappers';
import { argsGraphql, queryGraphql } from '../graphql';

class Query {
  private name;
  private resolvers;
  private options;

  constructor({ name, resolvers = {}, options = {} as any }) {
    this.name = name;
    this.resolvers = resolvers;
    this.options = options;

    return this;
  }

  public gql() {
    const resolverMap = getResolverFieldMap(this.name);

    const operations = Object.entries(resolverMap).reduce((acc, [key, value]) => {
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

    return queryGraphql(operations);
  }
}

export const QueryFactory = ({ name, resolvers = {}, options = {} as any }) =>
  new Query({ name, resolvers, options });
