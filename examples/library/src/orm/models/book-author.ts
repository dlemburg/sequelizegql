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
import { Author } from './author';
import { Book } from './book';

@Table({ underscored: true, tableName: 'book_author', paranoid: true })
export class BookAuthor extends Model<BookAuthor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Author)
  authorId: number;

  @Column
  @ForeignKey(() => Book)
  bookIsbn: number;

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
}
