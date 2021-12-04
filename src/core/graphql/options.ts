export const optionsQueryInputNameGql = () => `OptionsInput`;

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
    order: [OrderInput]
    group: String
  }
`;

// offset: Int
// limit: Int
