import { Sequelize } from 'sequelize-typescript';

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

  const orm = process.argv[2];

  if (orm === 'sequelize') {
    require('./models/sequelize');
  } else {
    const modelsExport = require('./models/sequelize-typescript');
    const models = Object.values(modelsExport);

    sequelize.addModels(models);
  }

  try {
    await sequelize.authenticate();
    console.log('Sequelize connected');
    // await sequelize.sync({ force: true });
  } catch (error) {
    console.log('Sequelize connection error: ', error);
  }

  return sequelize;
};
