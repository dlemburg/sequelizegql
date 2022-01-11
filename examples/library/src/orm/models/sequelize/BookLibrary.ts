import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize';

export const BookLibrary = sequelize.define(
  'BookLibrary',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
    },
    libraryId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    underscored: true,
    tableName: 'book_library',
    paranoid: true,
    timestamps: true,
  }
);
