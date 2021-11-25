export const TOP_LEVEL_OPERATORS_GQL_MAP = {
  AND: (whereInputName?: string) => ({
    gql: () => `[${whereInputName}]`,
    op: 'and',
    getValue: (value) => value,
  }),
  OR: (whereInputName?: string) => ({
    gql: () => `[${whereInputName}]`,
    op: 'or',
    getValue: (value) => value,
  }),
};

export const OPERATORS_FILTERS_MAP = {
  LIKE: () => ({
    gql: () => 'String!',
    op: 'like',
    getValue: (value) => `%${value}`,
  }),
  NOT_LIKE: () => ({
    gql: () => 'String!',
    op: 'notLike',
    getValue: (value) => `%${value}`,
  }),
  STARTS_WITH: () => ({
    gql: () => 'String!',
    op: 'startsWith',
    getValue: (value) => value,
  }),
  ENDS_WITH: () => ({
    gql: () => 'String!',
    op: 'endsWith',
    getValue: (value) => value,
  }),
  SUBSTRING: () => ({
    gql: () => 'String!',
    op: 'substring',
    getValue: (value) => value,
  }),
  EQ: () => ({
    gql: () => 'JSON!',
    op: 'eq',
    getValue: (value) => value,
  }),
  NE: () => ({
    gql: () => 'JSON!',
    op: 'ne',
    getValue: (value) => value,
  }),
  IS_NULL: () => ({
    gql: () => 'String!',
    op: 'is',
    getValue: (value) => value,
  }),
  NOT: () => ({
    gql: () => 'JSON!',
    op: 'not',
    getValue: (value) => value,
  }),
  GT: () => ({
    gql: () => 'Int!',
    op: 'gt',
    getValue: (value) => value,
  }),
  GTE: () => ({
    gql: () => 'Int!',
    op: 'gte',
    getValue: (value) => value,
  }),
  LT: () => ({
    gql: () => 'Int!',
    op: 'lt',
    getValue: (value) => value,
  }),
  LTE: () => ({
    gql: () => 'Int!',
    op: 'lte',
    getValue: (value) => value,
  }),
  BETWEEN: () => ({
    gql: () => 'JSON!',
    op: 'between',
    getValue: (value) => value,
  }),
  NOT_BETWEEN: () => ({
    gql: () => 'JSON!',
    op: 'notBetween',
    getValue: (value) => value,
  }),
  IN: () => ({
    gql: () => 'JSON!',
    op: 'in',
    getValue: (value) => value,
  }),
  NOT_IN: () => ({
    gql: () => 'JSON!',
    op: 'notIn',
    getValue: (value) => value,
  }),
};
