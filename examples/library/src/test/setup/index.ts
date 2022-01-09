import { init } from '../../orm/sequelize';

jest.setTimeout(30000);

export const setup = async () => {
  return init();
};
