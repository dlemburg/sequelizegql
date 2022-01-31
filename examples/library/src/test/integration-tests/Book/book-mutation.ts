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
      mutation Mutation($input: UpdateBookInput!, $where: BookWhereInput) {
        updateBook(input: $input, where: $where) {
          title
        }
      }
    `,
    body: {
      input: {
        title: 'Sports 101 (updated)',
      },
      where: {
        id: 999,
      },
    },
    response: {
      data: {
        updateBook: {
          title: 'Sports 101 (updated)',
        },
      },
    },
    responseTruthyAssertionFn: () => false,
  }),
};

const upsert = {
  root: () => ({
    query: `
      mutation Mutation($input: BookInput!, $where: BookWhereInput) {
        upsertBook(input: $input, where: $where) {
          isbn
          title
          id
        }
      }
    `,
    body: {
      input: {
        isbn: '23423423423423423423',
        title: 'A book with no title',
      },
      where: { id: 1000000 },
    },
    response: {
      data: {
        upsertBook: {
          isbn: '23423423423423423423',
          title: 'A book with no title',
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
