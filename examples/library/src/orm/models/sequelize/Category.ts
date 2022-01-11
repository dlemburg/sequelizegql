import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize';

export const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: 'category',
    paranoid: true,
    timestamps: true,
  }
);
