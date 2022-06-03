import { nullableGql } from '../graphql/nullable';

export const SEQUELIZE_GRAPHQL_TYPE_MAP = {
  DECIMAL: () => 'Float',
  INTEGER: () => 'Int',
  BIGINT: () => 'Int',
  FLOAT: () => 'Int',
  REAL: () => 'Int',
  DOUBLE: () => 'Int',
  GEOMETRY: () => 'String',
  BLOB: () => 'String',
  STRING: () => 'String',
  'STRING.BINARY': () => 'String',
  TEXT: () => 'String',
  CITEXT: () => 'String',
  UUID: () => 'String',
  UUIDV4: () => 'String',
  DATE: () => 'DateTime',
  DATEONLY: () => 'DateTime',
  JSON: () => 'JSON',
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
