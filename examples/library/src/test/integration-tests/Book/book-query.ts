export const findAll = {
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
    responseTruthyAssertionFn: (response) => response.data.allBooks.length > 1,
  }),
};

export const findOne = {
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

export const findMany = {
  root: (id: number) => ({
    query: `
      query Books($where: BookWhereInput) {
        books(where: $where) {
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
      query Books {
        books {
          id
          category {
            id
          }
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
    body: {},
    response: {
      data: {
        books: [
          {
            id: 999,
            category: {
              id: 999,
            },
            libraries: [
              {
                id: 999,
                city: {
                  id: 999,
                },
              },
            ],
            authors: [
              {
                id: 999,
              },
            ],
          },
        ],
      },
    },
    responseTruthyAssertionFn: () => false,
  }),
  withAssociationFilters: () => ({
    query: ({ libraryId, cityId } = { libraryId: 999, cityId: 999 }) => `
      query Books($where: BookWhereInput) {
        books(where: $where) {
          id
          category {
            id
          }
          libraries(where: { id: ${libraryId} }) {
            id
            city(where: { id: ${cityId} }) {
              id
            }
          }
          authors {
            id
          }
        }
      }
    `,
    body: {},
    response: {
      data: {
        books: [
          {
            id: 999,
            category: {
              id: 999,
            },
            libraries: [
              {
                id: 999,
                city: {
                  id: 999,
                },
              },
            ],
            authors: [
              {
                id: 999,
              },
            ],
          },
        ],
      },
    },
    responseTruthyAssertionFn: () => false,
  }),
};

export const findManyPaged = {
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
    response: null,
    responseTruthyAssertionFn: (response) =>
      response.entities.length > 0 && response.totalCount > 0,
  }),
};
