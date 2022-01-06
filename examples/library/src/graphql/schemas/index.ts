import SequelizeGraphql, { InitializeInput, InitializeResponse } from '../../../../../src';

export const getSchema = async (options: InitializeInput): Promise<InitializeResponse> => {
  const graphqlSequelize = new SequelizeGraphql();
  const schema = await graphqlSequelize.schema(options);

  // graphqlSequelize.printConsole();
  // graphqlSequelize.outputTypedefs();

  return schema;
};
