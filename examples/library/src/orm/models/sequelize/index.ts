import { Author } from './Author';
import { Book } from './Book';
import { Category } from './Category';
import { City } from './City';
import { Library } from './Library';

export * from './Author';
export * from './BookAuthor';
export * from './BookLibrary';
export * from './Book';
export * from './Category';
export * from './City';
export * from './Library';

Author.belongsToMany(Book, { through: 'BookAuthor' });
Book.belongsToMany(Author, { through: 'BookAuthor' });

Book.belongsToMany(Library, { through: 'BookLibrary' });
Library.belongsToMany(Book, { through: 'BookLibrary' });

Book.belongsTo(Category);
Category.hasMany(Book);

Library.belongsTo(City);
City.hasMany(Library);
