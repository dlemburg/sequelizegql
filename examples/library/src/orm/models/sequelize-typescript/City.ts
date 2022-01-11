import {
  Table,
  Column,
  Model,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AutoIncrement,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'city', paranoid: true })
export class City extends Model<City> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  postalCode: String;

  @AllowNull(false)
  @Column
  name: String;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}
