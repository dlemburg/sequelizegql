export const TOP_LEVEL_OPERATORS_GQL_MAP = {
  AND: (whereInputName?: string) => ({
    gql: `[${whereInputName}]`,
    op: 'and',
    getValue: (value) => value,
  }),
  OR: (whereInputName?: string) => ({
    gql: `[${whereInputName}]`,
    op: 'or',
    getValue: (value) => value,
  }),
};
