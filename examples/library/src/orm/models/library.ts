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
  DataType,
  Default,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { LibraryStatus } from '../enums';
import { Book } from './Book';
import { BookLibrary } from './BookLibrary';
import { City } from './City';

@Table({ underscored: true, tableName: 'library', paranoid: true })
export class Library extends Model<Library> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => City)
  cityId: number;

  @AllowNull(false)
  @Column
  name: String;

  @Column
  address: String;

  @Column
  description: String;

  @AllowNull(false)
  @Default(LibraryStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(LibraryStatus)))
  status: LibraryStatus;

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
  removedAt: Date;

  // Associations
  @BelongsTo(() => City)
  city?: City;

  @BelongsToMany(() => Book, () => BookLibrary)
  books?: Book[];
}
