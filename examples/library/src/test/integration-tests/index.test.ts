import { setup } from '../setup';
import { allBooks, book, books, booksPaged } from './queries/Book';
import { createBook, updateBook, upsertBook, deleteBook } from './mutation/Book';

let testClient;

beforeAll(async () => {
  ({ testClient } = await setup());
});

describe('[index.test.ts] integration tests suite', () => {
  test('[getSchema] Book mutations', async () => {
    // create
    const createBookResult: any = await testClient.mutate(createBook.root.query, {
      variables: createBook.root.body,
    });
    const createBookId = createBookResult.data.createBook.id;
    delete createBookResult.data.createBook.id;
    expect(createBookResult).toEqual(createBook.root.response);

    // allBooks
    const allBooksResultAfterCreate: any = await testClient.query(allBooks.root.query, {
      variables: allBooks.root.body,
    });
    expect(allBooksResultAfterCreate.data.allBooks.length).toBeGreaterThan(1);

    // book
    const { query: bookQuery, body: bookBody, response: bookResponse } = book.root(createBookId);
    const bookResultAfterCreate: any = await testClient.query(bookQuery, {
      variables: bookBody,
    });
    expect(bookResultAfterCreate.data).toEqual(bookResponse);

    // books
    const {
      query: booksQuery,
      body: booksBody,
      responseTruthyAssertionFn: booksresponseTruthyAssertionFn,
    } = books.root(createBookId);
    const booksResultAfterCreate: any = await testClient.query(booksQuery, {
      variables: booksBody,
    });
    const booksTruthy = booksresponseTruthyAssertionFn?.(booksResultAfterCreate.data.books);
    expect(booksTruthy).toBeTruthy();

    // booksPaged
    const {
      query: booksPagedQuery,
      body: booksPagedBody,
      responseTruthyAssertionFn: booksPagedResponseTruthyAssertionFn,
    } = booksPaged.root();
    const booksPagedResultAfterCreate: any = await testClient.query(booksPagedQuery, {
      variables: booksPagedBody,
    });
    const booksPagedTruthy = booksPagedResponseTruthyAssertionFn?.(
      booksPagedResultAfterCreate.data.booksPaged
    );
    expect(booksPagedTruthy).toBeTruthy();

    // update
    const updateBookResult: any = await testClient.mutate(updateBook.root.query, {
      variables: updateBook.root.body,
    });
    expect(updateBookResult).toEqual(updateBook.root.response);

    // upsert
    const upsertBookResult: any = await testClient.mutate(upsertBook.root.query, {
      variables: upsertBook.root.body,
    });
    expect(upsertBookResult).toEqual(upsertBook.root.response);

    // delete
    const { query, body, response } = deleteBook.root(createBookId);
    const deleteBookResult: any = await testClient.mutate(query, {
      variables: body,
    });
    expect(deleteBookResult).toEqual(response);
  });
});
