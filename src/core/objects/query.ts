import { getResolverFieldMap } from '../mappers';
import { args } from '../graphql/args';

export const QueryBuilder = ({ name, resolvers = {}, options = {} as any }) => {
  const resolverMap = getResolverFieldMap(name);

  const operations = Object.entries(resolverMap).reduce((acc, [key, value]) => {
    const argsValue = args(value.args);
    const result = `${
      resolvers[value.name]?.generate !== false
        ? `${value.name}${argsValue}: ${value.returnType} ${
            resolvers[value.name]?.directive ?? options?.baseDirective ?? ''
          }`
        : ''
    }`;

    return acc + result + `\n`;
  }, '');

  return {
    gql: `
      extend type Query {
        ${operations}
      }
    `,
  };
};
