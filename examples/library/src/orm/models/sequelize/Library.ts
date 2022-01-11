import { DataTypes } from 'sequelize';
import { sequelize } from '../../sequelize';

export const Library = sequelize.define(
  'Library',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cityId: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    },
  },
  {
    underscored: true,
    tableName: 'library',
    paranoid: true,
    timestamps: true,
  }
);

// Associations
// @BelongsTo(() => City)
// city?: City;

// @BelongsToMany(() => Book, () => BookLibrary)
// books?: Book[];
