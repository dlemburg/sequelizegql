import faker from 'faker';
import { SEQUELIZE_GRAPHQL_TYPE_MAP } from '../mappers';

export const buildFakerData = (data) => {
  return Object.entries(data).reduce((acc, [key, typeInfo]: any) => {
    // TODO: this should be improved
    if (['ARRAY', 'ENUM', 'ASSOCIATION'].includes(typeInfo.sequelizeType)) return acc;

    const fakerType = SEQUELIZE_GRAPHQL_TYPE_MAP[typeInfo.sequelizeType]?.();
    const value = faker.datatype?.[fakerType]?.();

    return { ...acc, ...(value && { [key]: value }) };
  }, {});
};
