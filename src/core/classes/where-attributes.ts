import { KeyValuePairs, ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';

class WhereAttributes {
  constructor() {
    return this;
  }

  public keyValuePairs(whereAttributes, modelAttributes: ModelAttributes): KeyValuePairs[] {
    // const DEFAULT_WHERE_ATTRIBUTES = [
    //   {
    //     key: 'id',
    //     value: mapSequelizeToGraphql(modelAttributes['id'], { generateNullable: false }),
    //   },
    // ];

    const result =
      whereAttributes?.reduce((acc, x) => {
        if (modelAttributes[x]) {
          const value = mapSequelizeToGraphql(modelAttributes[x], { generateNullable: false });

          acc.push({ key: x, value });
        }

        return acc;
      }, []) ?? [];

    return result;
  }
}

export const WhereAttributeFactory = () => new WhereAttributes();
