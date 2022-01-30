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
      query Books($where: BookWhereInput) {
        books(where: $where) {
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
    response: null,
    responseTruthyAssertionFn: () => false,
  }),
  withAssociationFilters: () => ({
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
