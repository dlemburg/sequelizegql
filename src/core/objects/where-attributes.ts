import { mapSequelizeToGraphql } from '../mappers';

export const WhereAttributesBuilder = (whereAttributes, modelAttributes) => {
  const result = whereAttributes?.reduce((acc, x) => {
    if (modelAttributes[x]) {
      const value = mapSequelizeToGraphql(modelAttributes[x], { generateNullable: false });

      acc.push({ key: x, value });
    }

    return acc;
  }, []) ?? [
    { key: 'id', value: mapSequelizeToGraphql(modelAttributes['id'], { generateNullable: false }) },
  ];

  return result;
};
