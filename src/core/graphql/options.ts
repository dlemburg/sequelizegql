export const optionsQueryInputGql = () => `OptionsInput`;

export const optionsQueryGql = () => `
 
  enum OrderDirection {
    ASC
    DESC
  }

  input OrderInput {
    field: String
    dir: OrderDirection
  }

  input ${optionsQueryInputGql()} {
    offset: Int
    limit: Int
    order: [OrderInput]
  }
`;
