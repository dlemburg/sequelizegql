import { BaseService } from '../../../../../src/core/services';
import { Category, City, Library, Book, Author } from '../../orm/models/sequelize-typescript';

export const seed = async (sequelize) => {
  const city = (await BaseService(sequelize.models.City).create({
    name: 'Modesto',
    postalCode: '12345',
  })) as City;
  const library = (await BaseService(sequelize.models.Library).create({
    name: 'Modesto Library',
    address: '123 Library Lane',
    description: 'Youre favorit local library!',
    cityId: city.id,
    status: 'ACTIVE',
  })) as Library;
  const category = (await BaseService(sequelize.models.Category).create({
    name: 'Sports',
  })) as Category;
  const book = (await BaseService(sequelize.models.Book).create({
    categoryId: category.id,
    title: 'Sports 101',
    isbn: '2849812949',
  })) as Book;
  const bookLibrary = await BaseService(sequelize.models.BookLibrary).create({
    bookId: book.id,
    library: library.id,
  });
  const author = (await BaseService(sequelize.models.Author).create({
    name: 'I was never given a name',
    birthDate: '01-01-1975',
  })) as Author;
  const bookAuthor = await BaseService(sequelize.models.BookAuthor).create({
    bookId: book.id,
    authorId: author.id,
  });
};
