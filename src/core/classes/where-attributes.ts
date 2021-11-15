import { mapSequelizeToGraphql } from '../mappers';

class WhereAttributes {
  private whereAttributes;
  private modelAttributes;

  constructor(whereAttributes, modelAttributes) {
    this.whereAttributes = whereAttributes;
    this.modelAttributes = modelAttributes;

    return this;
  }

  public keyValuePairs() {
    const result = this.whereAttributes?.reduce((acc, x) => {
      if (this.modelAttributes[x]) {
        const value = mapSequelizeToGraphql(this.modelAttributes[x], { generateNullable: false });

        acc.push({ key: x, value });
      }

      return acc;
    }, []) ?? [
      {
        key: 'id',
        value: mapSequelizeToGraphql(this.modelAttributes['id'], { generateNullable: false }),
      },
    ];

    return result;
  }
}

export const WhereAttributeFactory = (whereAttributes, modelAttributes) =>
  new WhereAttributes(whereAttributes, modelAttributes);
