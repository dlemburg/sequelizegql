import _ from 'lodash';
import { StateFactory } from '../../classes/state';
import { KeyedAttribute, ModelAttribute } from '../../../types';
import { uppercaseFirstLetter } from '../../util';

const getEnumName = (value) => {
  const name = `${uppercaseFirstLetter(value.fieldName)}Enum`;

  return name;
};

export const buildModelAttributes = (rawAttributes): KeyedAttribute => {
  return Object.entries(rawAttributes ?? {}).reduce((acc, [property, value]: any) => {
    const values = value.values ?? [];
    let type = value.type.key ?? '';
    let sequelizeType = type;
    let isArray = false;
    let isEnum = false;

    switch (type) {
      case 'ENUM': {
        isEnum = true;
        type = getEnumName(value);
        break;
      }
      case 'ARRAY': {
        isArray = true;
        type =
          value.type?.options?.type?.key === 'ENUM'
            ? getEnumName(value)
            : value.type?.options?.type?.key;
        break;
      }
    }

    return {
      ...acc,
      [property]: {
        sequelizeType,
        type,
        isArray,
        isEnum,
        allowNull: value.allowNull === false ? false : true,
        values,
      },
    };
  }, {});
};

export const buildModelAssociations = (associations): KeyedAttribute => {
  return Object.entries(associations ?? []).reduce((acc, [property, value]: any) => {
    acc[property] = {
      sequelizeType: 'ASSOCIATION',
      type: value.target.name,
      isArray: value.associationType === 'HasMany' || value.associationType === 'BelongsToMany',
      allowNull: true,
      values: [],
    };
    return acc;
  }, {});
};

export const getAttributes = (model) => (): ModelAttribute => {
  const associations = buildModelAssociations(model.associations);
  const attributes = buildModelAttributes(model.rawAttributes);
  const result = { ...attributes, associations };

  return result as ModelAttribute;
};

export const buildAssociationCreateOptions = (model) => (input) => {
  try {
    const models = StateFactory().getModels();
    const attributes = getAttributes(model)();
    const associationOptions = Object.keys(input)?.reduce((acc, key) => {
      const value = attributes?.associations?.[key];
      const type = value?.type;
      const Model = type ? models?.[type] : null;

      if (Model) {
        const include = [Model];
        return acc?.include ? { include: [...acc.include, ...include] } : { ...acc, include };
      }
    }, {} as any);

    return associationOptions;
  } catch {
    return {};
  }
};
