import { ModelAttributes } from '../../types';
import { mapSequelizeToGraphql } from '../mappers';

type KeyValuePairsResponse = {
  key: string;
  value: string;
};

class WhereAttributes {
  private whereAttributes;
  private modelAttributes: ModelAttributes;

  constructor(whereAttributes, modelAttributes) {
    this.whereAttributes = whereAttributes;
    this.modelAttributes = modelAttributes;

    return this;
  }

  public keyValuePairs(): KeyValuePairsResponse {
    const DEFAULT_WHERE_ATTRIBUTES = [
      {
        key: 'id',
        value: mapSequelizeToGraphql(this.modelAttributes['id'], { generateNullable: false }),
      },
    ];

    const result =
      this.whereAttributes?.reduce((acc, x) => {
        if (this.modelAttributes[x]) {
          const value = mapSequelizeToGraphql(this.modelAttributes[x], { generateNullable: false });

          acc.push({ key: x, value });
        }

        return acc;
      }, []) ?? DEFAULT_WHERE_ATTRIBUTES;

    return result;
  }
}

export const WhereAttributeFactory = (whereAttributes, modelAttributes) =>
  new WhereAttributes(whereAttributes, modelAttributes);
