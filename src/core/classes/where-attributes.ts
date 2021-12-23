import { KeyValuePairs, ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';

class WhereAttributes {
  constructor() {
    return this;
  }

  public keyValuePairs(
    whereAttributes: string[] | undefined,
    modelWhereAttributes: ModelAttributes
  ): KeyValuePairs[] {
    const attributes = whereAttributes?.length ? whereAttributes : Object.keys(modelWhereAttributes);

    const result =
      attributes?.reduce((acc, x) => {
        if (modelWhereAttributes[x]) {
          const value = mapSequelizeToGraphql(modelWhereAttributes[x], { generateNullable: false });

          acc.push({ key: x, value });
        }

        return acc;
      }, [] as KeyValuePairs[]) ?? [];

    return result;
  }
}

export const WhereAttributeFactory = () => new WhereAttributes();
