import { KeyValuePairs, ModelAttribute } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';

class whereInputAttributes {
  constructor() {
    return this;
  }

  public keyValuePairs(
    whereInputAttributes: string[] | undefined,
    modelwhereInputAttributes: ModelAttribute
  ): KeyValuePairs[] {
    const attributes = whereInputAttributes?.length
      ? whereInputAttributes
      : Object.keys(modelwhereInputAttributes);

    const result =
      attributes?.reduce((acc, x) => {
        if (modelwhereInputAttributes[x]) {
          const value = mapSequelizeToGraphql(modelwhereInputAttributes[x], {
            generateNullable: false,
          });

          acc.push({ key: x, value });
        }

        return acc;
      }, [] as KeyValuePairs[]) ?? [];

    return result;
  }
}

export const WhereAttributeFactory = () => new whereInputAttributes();
