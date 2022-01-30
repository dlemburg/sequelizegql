const create = {
  root: () => ({
    query: `
      mutation CreateBook($input: BookInput!) {
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
    responseTruthyAssertionFn: () => false,
  }),
};

const createMany = {
  root: () => ({
    query: `
      mutation CreateManyBooks($input: [BookInput!]!) {
        createManyBooks(input: $input) {
          isbn
          title
        }
      }
    `,
    body: {
      input: [
        {
          isbn: '1111111111',
          title: 'Book Title 1111111111',
        },
        {
          isbn: '2222222222',
          title: 'Book Title 2222222222',
        },
      ],
    },
    response: {
      data: {
        createManyBooks: [
          {
            isbn: '1111111111',
            title: 'Book Title 1111111111',
          },
          {
            isbn: '2222222222',
            title: 'Book Title 2222222222',
          },
        ],
      },
    },
    responseTruthyAssertionFn: () => false,
  }),
};

const update = {
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
    responseTruthyAssertionFn: () => false,
  }),
};

const upsert = {
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
    responseTruthyAssertionFn: () => false,
  }),
};

const destroy = {
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
    responseTruthyAssertionFn: () => false,
  }),
};

export { create, createMany, update, upsert, destroy };
