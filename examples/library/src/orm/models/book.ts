import {
  Table,
  Column,
  Model,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  BelongsTo,
  BelongsToMany,
  ForeignKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { Author } from './author';
import { BookAuthor } from './book-author';
import { BookLibrary } from './book-library';
import { Category } from './category';
import { Library } from './library';

@Table({ underscored: true, tableName: 'book', paranoid: true })
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  isbn: String;

  @AllowNull(false)
  @Column
  title: String;

  @Column
  @ForeignKey(() => Category)
  categoryId: number;

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
  @BelongsTo(() => Category)
  category?: Category;

  @BelongsToMany(() => Author, () => BookAuthor)
  authors?: Author[];

  @BelongsToMany(() => Library, () => BookLibrary)
  libraries?: Library[];
}
