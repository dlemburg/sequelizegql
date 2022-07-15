import { Op } from 'sequelize';

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
    gql: () => 'String',
    op: Op.like,
    getValue: (value) => `%${value}%`,
  }),
  ILIKE: () => ({
    gql: () => 'String',
    op: Op.iLike,
    getValue: (value) => `%${value}%`,
  }),
  NOT_LIKE: () => ({
    gql: () => 'String',
    op: Op.notLike,
    getValue: (value) => `%${value}%`,
  }),
  STARTS_WITH: () => ({
    gql: () => 'String',
    op: Op.startsWith,
    getValue: (value) => value,
  }),
  ENDS_WITH: () => ({
    gql: () => 'String',
    op: Op.endsWith,
    getValue: (value) => value,
  }),
  SUBSTRING: () => ({
    gql: () => 'String',
    op: Op.substring,
    getValue: (value) => value,
  }),
  EQ_STRING: () => ({
    gql: () => 'String',
    op: Op.eq,
    getValue: (value) => value,
  }),
  NE_STRING: () => ({
    gql: () => 'String',
    op: Op.ne,
    getValue: (value) => value,
  }),
  EQ_INT: () => ({
    gql: () => 'Int',
    op: Op.eq,
    getValue: (value) => value,
  }),
  NE_INT: () => ({
    gql: () => 'Int',
    op: Op.ne,
    getValue: (value) => value,
  }),
  IS_NULL: () => ({
    gql: () => 'String',
    op: Op.is,
    getValue: (value) => null,
  }),
  NOT_STRING: () => ({
    gql: () => 'String',
    op: Op.not,
    getValue: (value) => value,
  }),
  NOT_INT: () => ({
    gql: () => 'Int',
    op: Op.not,
    getValue: (value) => value,
  }),
  GT: () => ({
    gql: () => 'Int',
    op: Op.gt,
    getValue: (value) => value,
  }),
  GTE: () => ({
    gql: () => 'Int',
    op: Op.gte,
    getValue: (value) => value,
  }),
  LT: () => ({
    gql: () => 'Int',
    op: Op.lt,
    getValue: (value) => value,
  }),
  LTE: () => ({
    gql: () => 'Int',
    op: Op.lte,
    getValue: (value) => value,
  }),
  BETWEEN_INT: () => ({
    gql: () => '[Int]',
    op: Op.between,
    getValue: (value) => value,
  }),
  BETWEEN_DATE: () => ({
    gql: () => '[DateTime]',
    op: Op.between,
    getValue: (value) => value,
  }),
  NOT_BETWEEN_INT: () => ({
    gql: () => '[Int]',
    op: Op.notBetween,
    getValue: (value) => value,
  }),
  NOT_BETWEEN_DATE: () => ({
    gql: () => '[DateTime]',
    op: Op.notBetween,
    getValue: (value) => value,
  }),
  IN_INT: () => ({
    gql: () => '[Int!]',
    op: Op.in,
    getValue: (value) => value,
  }),
  IN_STRING: () => ({
    gql: () => '[String!]',
    op: Op.in,
    getValue: (value) => value,
  }),
  NOT_IN_INT: () => ({
    gql: () => '[Int!]',
    op: Op.notIn,
    getValue: (value) => value,
  }),
  NOT_IN_STRING: () => ({
    gql: () => '[String!]',
    op: Op.notIn,
    getValue: (value) => value,
  }),
};
