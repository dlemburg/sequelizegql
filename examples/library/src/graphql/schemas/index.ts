import SequelizeGraphql from '../../../../../src';
import { InitializeInput, InitializeResponse } from '../../../../../src/types';

export const getSchema = async (options: InitializeInput): Promise<InitializeResponse> => {
  const graphqlSequelize = SequelizeGraphql();
  const schema = await graphqlSequelize.generateSchema(options);

  // graphqlSequelize.printConsole();
  // graphqlSequelize.outputTypedefs();

  return schema;
};
