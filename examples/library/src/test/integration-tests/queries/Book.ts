const allBooks = [
  {
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
  },
];

const book = [
  {
    query: `
    query Book($where: BookWhereInput) {
      book(where: $where) {
        id
      }
    }`,
    body: {
      where: {
        id: 1,
      },
    },
    response: {
      book: { id: null },
    },
  },
];

const books = [
  {
    query: `
    query Book {
      books {
        id
      }
    }`,
    body: {
      where: {
        id: 1,
      },
    },
    response: {
      books: [],
    },
  },
  {
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
  },
];

const booksPaged = [
  {
    query: `
    query Book($where: BookWhereInput) {
      booksPaged(where: $where) {
        totalCount
        entities {
          id
        }
      }
    }`,
    body: {
      where: {
        id: 1,
      },
    },
    response: {
      data: {
        booksPaged: {
          totalCount: 0,
          entities: [],
        },
      },
    },
  },
];
