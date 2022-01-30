import { BaseService } from '../../../../../src/core/services';

let ALL_FILTER = {};

export const cleanup = async (sequelize) => {
  await BaseService(sequelize.models.Library).destroy(ALL_FILTER, { force: true });
  await BaseService(sequelize.models.City).destroy(ALL_FILTER, { force: true });
  await BaseService(sequelize.models.Book).destroy(ALL_FILTER, { force: true });
  await BaseService(sequelize.models.BookLibrary).destroy(ALL_FILTER, { force: true });
  await BaseService(sequelize.models.Category).destroy(ALL_FILTER, { force: true });
  await BaseService(sequelize.models.Author).destroy(ALL_FILTER, { force: true });
  await BaseService(sequelize.models.BookAuthor).destroy(ALL_FILTER, { force: true });
};
