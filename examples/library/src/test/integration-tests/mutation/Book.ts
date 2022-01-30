export const createBook = {
  root: () => ({
    query: `
      mutation Mutation($input: BookInput!) {
        createBook(input: $input) {
          id
          isbn
          title
        }
      }
    `,
    body: {
      input: {
        isbn: '1234-66789',
        title: 'Book Title 1',
      },
    },
    response: {
      data: {
        createBook: {
          isbn: '1234-66789',
          title: 'Book Title 1',
        },
      },
    },
    responseTruthyAssertionFn: null,
  }),
};

export const updateBook = {
  root: () => ({
    query: `
      mutation Mutation($input: UpdateBookInput!) {
        updateBook(input: $input) {
          isbn
        }
      }
    `,
    body: {
      input: {
        isbn: '1234-6678910',
      },
    },
    response: {
      data: {
        updateBook: {
          isbn: '1234-6678910',
        },
      },
    },
    responseTruthyAssertionFn: null,
  }),
};

export const upsertBook = {
  root: () => ({
    query: `
      mutation Mutation($input: BookInput!) {
        upsertBook(input: $input) {
          isbn
        }
      }
    `,
    body: {
      input: {
        isbn: '1234-56789',
      },
    },
    response: {
      data: {
        upsertBook: {
          isbn: '1234-56789',
        },
      },
    },
    responseTruthyAssertionFn: null,
  }),
};

export const deleteBook = {
  root: (id: number) => ({
    query: `
      mutation Mutation($where: BookWhereInput) {
        deleteBook(where: $where) {
          id
          deletedCount
        }
      }
    `,
    body: {
      where: {
        id,
      },
    },
    response: {
      data: {
        deleteBook: {
          id,
          deletedCount: 1,
        },
      },
    },
    responseTruthyAssertionFn: null,
  }),
};
