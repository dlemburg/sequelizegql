export const optionsQueryInputNameGql = () => `OptionsInput`;
export const optionsPagedQueryInputNameGql = () => `${optionsQueryInputNameGql()}Paged`;

const baseOptiongsGql = `
  order: [OrderInput]
  group: String
  """
  Required only applies to nested includes that should act as 'inner joins'
  """
  required: Boolean
`;

export const optionsQueryGql = () => `
  enum OrderDirection {
    ASC
    DESC
  }

  input OrderInput {
    field: String
    dir: OrderDirection
  }

  input ${optionsQueryInputNameGql()} {
    ${baseOptiongsGql}
  }

  input ${optionsPagedQueryInputNameGql()} {
    ${baseOptiongsGql}
    offset: Int
    limit: Int
  }
`;
