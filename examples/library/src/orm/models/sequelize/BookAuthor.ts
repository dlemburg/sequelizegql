import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize';

export const BookAuthor = sequelize.define(
  'BookAuthor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
    },
    authorId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    underscored: true,
    tableName: 'book_author',
    paranoid: true,
    timestamps: true,
  }
);
