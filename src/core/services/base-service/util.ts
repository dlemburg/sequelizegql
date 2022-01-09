import _ from 'lodash';
import { StateFactory } from '../../classes/state';
import { ModelAttributes } from '../../../types';

export const getEnumType = (values) => {
  const result = Object.entries(StateFactory().getEnums()).find(
    ([, aEnum]: any) => _.difference(values, Object.values(aEnum))?.length === 0
  );

  return result?.[0];
};

export const buildModelAttributes = (rawAttributes) => {
  return Object.entries(rawAttributes ?? {}).reduce((acc, [property, value]: any) => {
    let type = value.type.key;
    let sequelizeType = type;
    let isArray = false;

    switch (type) {
      case 'ENUM': {
        type = getEnumType(value.type.values);
        break;
      }
      case 'ARRAY': {
        isArray = true;
        type =
          value.type?.options?.type?.key === 'ENUM'
            ? getEnumType(value?.type?.type?.values)
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
        allowNull: value.allowNull === false ? false : true,
      },
    };
  }, {});
};

export const buildModelAssociations = (associations) => {
  return Object.entries(associations ?? []).reduce((acc, [property, value]: any) => {
    acc[property] = {
      sequelizeType: 'ASSOCIATION',
      type: value.target.name,
      isArray: value.associationType === 'HasMany' || value.associationType === 'BelongsToMany',
      allowNull: true,
    };
    return acc;
  }, {});
};

export const getAttributes = (model) => (): ModelAttributes => {
  const associations = buildModelAssociations(model.associations);
  const attributes = buildModelAttributes(model.rawAttributes);

  return { ...attributes, associations };
};

export const buildAssociationCreateOptions = (model) => (input) => {
  try {
    const Models = StateFactory().getModels();
    const attributes = getAttributes(model)();
    const associationOptions = Object.keys(input)?.reduce((acc, key) => {
      const value = attributes?.associations?.[key];
      const type = value?.type;
      const Model = type && Models?.[type];

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
