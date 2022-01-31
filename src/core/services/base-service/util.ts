import _ from 'lodash';
import SequelizeGraphql from '../../..';
import { KeyedAttribute, ModelAttribute } from '../../../types';
import { lowercaseFirstLetter, uppercaseFirstLetter } from '../../util';

const getEnumName = (value) => {
  const name = `${uppercaseFirstLetter(value.fieldName)}Enum`;

  return name;
};

export const buildModelAttributes = (rawAttributes): KeyedAttribute => {
  return Object.entries(rawAttributes ?? {}).reduce((acc, [property, value]: [string, any]) => {
    if (acc[lowercaseFirstLetter(property)]) {
      return acc;
    }

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

    acc[property] = {
      sequelizeType,
      type,
      isArray,
      isEnum,
      allowNull: value.allowNull === false ? false : true,
      values,
      separate: false,
    };

    return acc;
  }, {});
};

export const buildModelAssociations = (associations): KeyedAttribute => {
  return Object.entries(associations ?? []).reduce((acc, [property, value]: any) => {
    const hasMany = value.associationType === 'HasMany';
    const isArray = hasMany || value.associationType === 'BelongsToMany';

    acc[property] = {
      sequelizeType: 'ASSOCIATION',
      type: value.target.name,
      isArray,
      isEnum: false,
      allowNull: true,
      values: [],
      separate: hasMany,
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
    const models = SequelizeGraphql().getSequelize().models;
    const attributes = getAttributes(model)();
    const associationOptions = Object.keys(input)?.reduce((acc, key) => {
      const value = attributes?.associations?.[key];
      const type = value?.type;
      const model = type ? models?.[type] : null;

      if (model) {
        if (typeof input.key === 'object') {
          // todo: recurse - haven't made much sense of api
        }
        const include = [model];
        return acc?.include ? { include: [...acc.include, ...include] } : { ...acc, include };
      }
    }, {} as any);

    return associationOptions;
  } catch {
    return {};
  }
};
