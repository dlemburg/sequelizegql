import {
  Table,
  Column,
  Model,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';
import { Library } from '.';
import { Book } from './Book';

@Table({ underscored: true, tableName: 'book_library', paranoid: true })
export class BookLibrary extends Model<BookLibrary> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Library)
  libraryId: number;

  @Column
  @ForeignKey(() => Book)
  bookId: number;

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
