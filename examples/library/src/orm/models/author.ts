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
  BelongsToMany,
} from 'sequelize-typescript';
import { Book } from './book';
import { BookAuthor } from './book-author';

@Table({ underscored: true, tableName: 'author', paranoid: true })
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: String;

  @Column
  surname: String;

  @Column
  birthDate: Date;

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
  @BelongsToMany(() => Book, () => BookAuthor)
  books?: Book[];
}
