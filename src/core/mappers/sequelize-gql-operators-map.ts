import { Op } from 'sequelize/types';

export const TOP_LEVEL_OPERATORS_GQL_MAP = {
  AND: (whereInputName?: string) => ({
    gql: () => `[${whereInputName}]`,
    op: Op.and,
    getValue: (value) => value,
  }),
  OR: (whereInputName?: string) => ({
    gql: () => `[${whereInputName}]`,
    op: Op.or,
    getValue: (value) => value,
  }),
};

export const OPERATORS_FILTERS_MAP = {
  LIKE: () => ({
    gql: () => 'String!',
    op: Op.like,
    getValue: (value) => `%${value}`,
  }),
  NOT_LIKE: () => ({
    gql: () => 'String!',
    op: Op.notLike,
    getValue: (value) => `%${value}`,
  }),
  STARTS_WITH: () => ({
    gql: () => 'String!',
    op: Op.startsWith,
    getValue: (value) => value,
  }),
  ENDS_WITH: () => ({
    gql: () => 'String!',
    op: Op.endsWith,
    getValue: (value) => value,
  }),
  SUBSTRING: () => ({
    gql: () => 'String!',
    op: Op.substring,
    getValue: (value) => value,
  }),
  EQ: () => ({
    gql: () => 'JSON!',
    op: Op.eq,
    getValue: (value) => value,
  }),
  NE: () => ({
    gql: () => 'JSON!',
    op: Op.ne,
    getValue: (value) => value,
  }),
  IS_NULL: () => ({
    gql: () => 'String!',
    op: Op.is,
    getValue: (value) => null,
  }),
  NOT: () => ({
    gql: () => 'JSON!',
    op: Op.not,
    getValue: (value) => value,
  }),
  GT: () => ({
    gql: () => 'Int!',
    op: Op.gt,
    getValue: (value) => value,
  }),
  GTE: () => ({
    gql: () => 'Int!',
    op: Op.gte,
    getValue: (value) => value,
  }),
  LT: () => ({
    gql: () => 'Int!',
    op: Op.lt,
    getValue: (value) => value,
  }),
  LTE: () => ({
    gql: () => 'Int!',
    op: Op.lte,
    getValue: (value) => value,
  }),
  BETWEEN: () => ({
    gql: () => 'JSON!',
    op: Op.between,
    getValue: (value) => value,
  }),
  NOT_BETWEEN: () => ({
    gql: () => 'JSON!',
    op: Op.notBetween,
    getValue: (value) => value,
  }),
  IN: () => ({
    gql: () => 'JSON!',
    op: Op.in,
    getValue: (value) => value,
  }),
  NOT_IN: () => ({
    gql: () => 'JSON!',
    op: Op.notIn,
    getValue: (value) => value,
  }),
};
