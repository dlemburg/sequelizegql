import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize';

export const Author = sequelize.define(
  'Author',
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
    birthDate: {
      type: DataTypes.DATE,
    },
  },
  {
    underscored: true,
    tableName: 'author',
    paranoid: true,
    timestamps: true,
  }
);
