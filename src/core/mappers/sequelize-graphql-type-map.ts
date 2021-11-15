import { nullableGql } from '../graphql/nullable';

export const SEQUELIZE_GRAPHQL_TYPE_MAP = {
  DECIMAL: () => 'Float',
  INTEGER: () => 'Int',
  STRING: () => 'String',
  TEXT: () => 'String',
  UUID: () => 'String',
  DATE: () => 'DateTime',
  JSONB: () => 'JSON',
  BOOLEAN: () => 'Boolean',
  ARRAY: (type, { isArray, suffix }) =>
    `[${SEQUELIZE_GRAPHQL_TYPE_MAP[type]?.() ?? type}${suffix ?? ''}]`,
  ENUM: (type) => SEQUELIZE_GRAPHQL_TYPE_MAP[type]?.() ?? type,
  ASSOCIATION: (type, { isArray, suffix }) =>
    isArray
      ? `[${SEQUELIZE_GRAPHQL_TYPE_MAP[type]?.() ?? type}${suffix ?? ''}]`
      : `${type}${suffix ?? ''}`,
};

export const mapSequelizeToGraphql = (
  { sequelizeType, type, allowNull, isArray }: any,
  { generateNullable = true, suffix = '' }
) => {
  const result = SEQUELIZE_GRAPHQL_TYPE_MAP[sequelizeType]?.(type, { isArray, suffix });

  if (!result) throw new Error(`Sequelize type <${sequelizeType} not mapped yet!`);

  return `${result}${generateNullable ? nullableGql(allowNull) : ''}`;
};
