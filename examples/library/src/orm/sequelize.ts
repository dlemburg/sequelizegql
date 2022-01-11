import { Sequelize } from 'sequelize-typescript';
// import * as Models from './models/sequelize';

// workaround for this: https://github.com/sequelize/sequelize/issues/8019
(Sequelize as any).postgres.DECIMAL.parse = function (value) {
  return parseFloat(value);
};

export let sequelize;
export const init = async () => {
  sequelize = new Sequelize({
    dialect: 'postgres',
    database: 'library',
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
  });

  require('./models/sequelize');

  // sequelize.addModels(models);
  // const models = Object.values(Models);

  try {
    await sequelize.authenticate();
    console.log('Sequelize connected');
    // sequelize.sync({ force: true });
  } catch (error) {
    console.log('Sequelize connection error: ', error);
  }

  return sequelize;
};
