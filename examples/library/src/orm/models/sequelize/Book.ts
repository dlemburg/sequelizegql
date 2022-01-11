import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize';

export const Book = sequelize.define(
  'Book',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    underscored: true,
    tableName: 'book',
    paranoid: true,
    timestamps: true,
  }
);
