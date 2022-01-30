const create = {
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

export { create, update, upsert, destroy };
