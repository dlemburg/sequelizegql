const createBook = [
  {
    query: `
      mutation Mutation($input: BookInput!) {
        createBook(input: $input) {
          id
          isbn
        }
      }
    `,
    body: {
      input: {
        isbn: '1234-66789',
      },
    },
    response: {
      data: {
        createBook: {
          id: 1,
          isbn: '1234-66789',
        },
      },
    },
  },
];

const updateBook = [
  {
    query: `
      mutation Mutation($input: UpdateBookInput!) {
        updateBook(input: $input) {
          id
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
          id: 1,
          isbn: '1234-6678910',
        },
      },
    },
  },
];

const upsertBook = [
  {
    query: `
      mutation Mutation($input: BookInput!) {
        upsertBook(input: $input) {
          id
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
          id: 1,
          isbn: '1234-56789',
        },
      },
    },
  },
];

const deleteBook = [
  {
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
        id: 1,
      },
    },
    response: {
      data: {
        deleteBook: {
          id: 1,
          deletedCount: 1,
        },
      },
    },
  },
];
