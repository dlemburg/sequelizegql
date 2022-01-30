import { BaseService } from '../../../../../src/core/services';
import { Category, City, Library, Book, Author } from '../../orm/models/sequelize-typescript';

const DEFAULT_ID = 999;

export const seed = async (sequelize) => {
  const city = (await BaseService(sequelize.models.City).create({
    id: DEFAULT_ID,
    name: 'Modesto',
    postalCode: '12345',
  })) as City;
  const library = (await BaseService(sequelize.models.Library).create({
    id: DEFAULT_ID,
    name: 'Modesto Library',
    address: '123 Library Lane',
    description: 'Youre favorit local library!',
    cityId: city.id,
    status: 'ACTIVE',
  })) as Library;
  const category = (await BaseService(sequelize.models.Category).create({
    id: DEFAULT_ID,
    name: 'Sports',
  })) as Category;
  const book = (await BaseService(sequelize.models.Book).create({
    id: DEFAULT_ID,
    categoryId: category.id,
    title: 'Sports 101',
    isbn: '2849812949',
  })) as Book;
  const bookLibrary = await BaseService(sequelize.models.BookLibrary).create({
    id: DEFAULT_ID,
    bookId: book.id,
    library: library.id,
  });
  const author = (await BaseService(sequelize.models.Author).create({
    id: DEFAULT_ID,
    name: 'I was never given a name',
    surname: 'I was never given a surname',
    birthDate: '01-01-1975',
  })) as Author;
  const bookAuthor = await BaseService(sequelize.models.BookAuthor).create({
    id: DEFAULT_ID,
    bookId: book.id,
    authorId: author.id,
  });
};
