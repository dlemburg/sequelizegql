import { Author } from './Author';
import { Book } from './Book';
import { Category } from './Category';
import { City } from './City';
import { Library } from './Library';
import { BookAuthor } from './BookAuthor';
import { BookLibrary } from './BookLibrary';

Author.belongsToMany(Book, { through: 'BookAuthor' });
Book.belongsToMany(Author, { through: 'BookAuthor' });

Book.belongsToMany(Library, { through: 'BookLibrary' });
Library.belongsToMany(Book, { through: 'BookLibrary' });

Book.belongsTo(Category);
Category.hasMany(Book);

Library.belongsTo(City);
City.hasMany(Library);

export { Author, Book, Category, City, Library, BookAuthor, BookLibrary };
