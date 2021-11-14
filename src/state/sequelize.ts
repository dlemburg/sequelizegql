let sequelize;

export const loadSequelize = (sequelizeInstance) => {
  sequelize = sequelizeInstance;
};
export const getSequelize = () => sequelize;
