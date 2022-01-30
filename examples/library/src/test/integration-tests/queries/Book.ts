export const allBooks = {
  root: () => ({
    query: `
      query AllBooks {
        allBooks {
          id
        }
      }`,
    body: {},
    response: {
      allBooks: [],
    },
    responseTruthyAssertionFn: () => false,
  }),
};

export const book = {
  root: (id: number) => ({
    query: `
      query Book($where: BookWhereInput) {
        book(where: $where) {
          id
        }
      }`,
    body: {
      where: {
        id,
      },
    },
    response: {
      book: { id },
    },
    responseTruthyAssertionFn: () => false,
  }),
};

export const books = {
  root: (id: number) => ({
    query: `
      query Book {
        books {
          id
        }
      }`,
    body: {
      where: {
        id,
      },
    },
    response: null,
    responseTruthyAssertionFn: (response) => response.find((x) => x.id === id),
  }),
  withAssociations: () => ({
    query: `
      query Book {
        books {
          id
          libraries {
            id
            city {
              id
            }
          }
          authors {
            id
          }
        }
      }`,
    body: {
      where: {},
    },
    response: {
      books: [],
    },
    responseTruthyAssertionFn: () => false,
  }),
  withFilters: {
    query: ({ libraryId, cityId }) => `
      query Books($where: BookWhereInput) {
        books(where: $where) {
          id
          libraries(where: { id: ${libraryId} }) {
            name
            city(where: { id: ${cityId} }) {
              id
            }
          }
          authors {
            surname
          }
        }
      }
    `,
    body: {
      where: {},
    },
    response: {},
    responseTruthyAssertionFn: () => false,
  },
};

export const booksPaged = {
  root: () => ({
    query: `
      query BooksPaged($where: BookWhereInput) {
        booksPaged(where: $where) {
          totalCount
          entities {
            id
          }
        }
      }`,
    body: {},
    response: {
      data: {
        booksPaged: {
          totalCount: 0,
          entities: [],
        },
      },
    },
    responseTruthyAssertionFn: (response) =>
      response.entities.length > 0 && response.totalCount > 0,
  }),
};
