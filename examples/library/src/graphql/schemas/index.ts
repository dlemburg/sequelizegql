import SequelizeGraphql, { InitializeInput } from '../../../../../src';

export const getSchema = async (options: InitializeInput) => {
  const graphqlSequelize = new SequelizeGraphql();
  const schema = await graphqlSequelize.schema(options);

  // graphqlSequelize.printConsole();
  // graphqlSequelize.outputTypedefs();

  return {
    typeDefs: schema.typedefs,
    resolvers: schema.resolvers,
  };
};
