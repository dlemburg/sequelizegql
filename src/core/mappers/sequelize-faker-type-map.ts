export const SEQUELIZE_FAKER_TYPE_MAP = {
  DECIMAL: () => 'number',
  INTEGER: () => 'number',
  STRING: () => 'string',
  UUID: () => 'uuid',
  UUIDV4: () => 'uuid',
  DATE: () => 'datetime',
  JSONB: () => 'json',
  BOOLEAN: () => 'boolean',
  ARRAY: (type) => `array`,
  ENUM: (type) => null,
  ASSOCIATION: (type, isArray) => [],
};
