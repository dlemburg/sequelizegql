import { Enums } from '../../types';

export const enumToArray = (e) => [...Object.values(e)];

export const buildEnums = (Enums = {}) =>
  Object.entries(Enums).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: { values: enumToArray(value) } }),
    {}
  );
