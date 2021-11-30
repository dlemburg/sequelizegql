import _ from 'lodash';
import { Model, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import { buildSortDesc } from '../util/sequelize-util';
import { BaseServiceFilter, BaseServiceOptions, ModelAttributes } from '../types/types';
import { StateFactory } from '../core/classes/state';

const getEnumType = (values) => {
  const result = Object.entries(StateFactory().getEnums()).find(
    ([, aEnum]: any) => _.difference(values, Object.values(aEnum))?.length === 0
  );

  return result?.[0];
};

const buildModelAttributes = (rawAttributes) => {
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

const buildModelAssociations = (associations) => {
  return Object.entries(associations ?? []).reduce((acc, [property, value]: any) => {
    acc[property] = {
      sequelizeType: 'ASSOCIATION',
      type: value.target.name,
      isArray: value.associationType === 'HasMany',
      allowNull: true,
    };
    return acc;
  }, {});
};

const buildAssociationOptions = (model) => (input) => {
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

const findAll =
  (model) =>
  (where = {}, options = {}) =>
    model.findAll({ where, ...options });

const findOne =
  (model) =>
  (where = {}, options = {}) =>
    model.findOne({ where, ...options });

const create =
  (model) =>
  (input, options = {}) => {
    const associationOptions = buildAssociationOptions(model)(input);

    return model.create(input, { ...options, ...associationOptions });
  };

const bulkCreate =
  (model) =>
  (input, options = {}) => {
    const associationOptions = buildAssociationOptions(model)(input);

    return model.bulkCreate(input, { ...options, ...associationOptions, validate: true });
  };

const update =
  (model) =>
  async (updates, where = {}, options = {}) => {
    await model.update(updates, { where, ...options });

    const savedInstance = await model.findOne({ where, ...options });

    return savedInstance;
  };

const upsert =
  (model) =>
  async (input, where = {}, options = {} as any) => {
    const sequelize = StateFactory().getSequelize();
    return sequelize.transaction(async (transaction) => {
      transaction = options?.transaction ?? transaction;

      const instance = await findOne(model)(where, { ...options, transaction });

      const data = !instance
        ? await options?.onBeforeCreate()
        : await options?.onBeforeUpdate(instance);
      const value = { ...input, ...data };

      if (!instance) {
        return create(model)(value, { ...options, transaction });
      }

      const savedInstance = await update(model)(value, where, { ...options, transaction });

      return savedInstance;
    });
  };

const destroy =
  (model) =>
  async (where, options = {}) => {
    await model.destroy({ where, ...options });

    return { id: where?.id };
  };

const findLastCreated =
  (model) =>
  async (where = {}, options = {}) => {
    const latestCreated = await findOne(model)(where, {
      ...options,
      order: buildSortDesc('createdAt'),
    });

    return latestCreated;
  };

const findById =
  (model) =>
  (id, options = {}) =>
    findOne(model)({ id }, options);

const findOneIncludingDestroyed = (model) => (where, options) =>
  findOne(model)(where, { ...options, paranoid: false });

const findAllIncludingDestroyed = (model) => (where, options) =>
  findAll(model)(where, { ...options, paranoid: false });

const findAllWithAssociations = (model) => async (where, options) => {
  try {
    const scopedModel = model.scope('withAssociations');

    const result = await findAll(scopedModel)(where, { ...options });

    return result;
  } catch {
    // do nothing -> just use default below
  }

  return findAll(model)(where, { ...options, include: { all: true } });
};

const findOneWithAssociations = (model) => async (where, options) => {
  try {
    const scopedModel = model.scope('withAssociations');

    const result = await findOne(scopedModel)(where, { ...options });

    return result;
  } catch {
    // do nothing -> just use default below
  }

  return findOne(model)(where, { ...options, include: { all: true } });
};

const restore = (model) => async (where, options) => {
  const result: any = await findOne(model)(where, {
    ...options,
    paranoid: false,
  });

  if (!result) return;

  await result.restore();

  return result;
};

export const getAttributes = (model) => (): ModelAttributes => {
  const associations = buildModelAssociations(model.associations);
  const attributes = buildModelAttributes(model.rawAttributes);

  return { ...attributes, associations };
};

export type BaseServiceInterface<T> = {
  getModelName: () => string;
  getModel: () => T;
  getAttributes: () => ModelAttributes;
  findAll: (filter?: BaseServiceFilter<T>, options?: BaseServiceOptions<T>) => Promise<T[]>;
  findAllIncludingDestroyed: (
    filter?: BaseServiceFilter<T>,
    options?: BaseServiceOptions<T>
  ) => Promise<T[]>;
  findAllWithAssociations: (
    filter?: BaseServiceFilter<T>,
    options?: BaseServiceOptions<T>
  ) => Promise<T[]>;
  findOneWithAssociations: (
    filter: BaseServiceFilter<T>,
    options?: BaseServiceOptions<T>
  ) => Promise<T>;
  findOne: (filter: BaseServiceFilter<T>, options?: BaseServiceOptions<T>) => Promise<T>;
  findOneIncludingDestroyed: (
    filter: BaseServiceFilter<T>,
    options?: BaseServiceOptions<T>
  ) => Promise<T>;
  findById: (id: number, options?: BaseServiceOptions<T>) => Promise<T>;
  findLastCreated: (filter?, options?: BaseServiceOptions<T>) => Promise<T>;
  create: (input: Partial<T>, options?: CreateOptions<T>) => Promise<T>;
  bulkCreate: (input: Partial<T>[], options?: CreateOptions<T>) => Promise<T[]>;
  update: (
    updates: Partial<T>,
    where: BaseServiceFilter<T>,
    options?: Omit<UpdateOptions<T>, 'where'>
  ) => Promise<T>;
  upsert: (
    input: Partial<T>,
    where: BaseServiceFilter<T>,
    updateOnlyInput?: Partial<T>,
    options?: Omit<UpdateOptions<T>, 'where'>
  ) => Promise<T>;
  destroy: (filter: BaseServiceFilter<T>, options?: DestroyOptions<T>) => Promise<{ id: number }>;
  restore: (filter: BaseServiceFilter<T>, options?: Omit<UpdateOptions<T>, 'where'>) => Promise<T>;
};

export const BaseService = <T>(
  model: T extends Model<any, any> ? any : any
): BaseServiceInterface<T> => ({
  getModelName: () => model.name,
  getModel: model,
  getAttributes: getAttributes(model),
  findAll: findAll(model),
  findAllIncludingDestroyed: findAllIncludingDestroyed(model),
  findAllWithAssociations: findAllWithAssociations(model),
  findOneWithAssociations: findOneWithAssociations(model),
  findOne: findOne(model),
  findOneIncludingDestroyed: findOneIncludingDestroyed(model),
  findById: findById(model),
  findLastCreated: findLastCreated(model),
  create: create(model),
  bulkCreate: bulkCreate(model),
  update: update(model),
  upsert: upsert(model),
  destroy: destroy(model),
  restore: restore(model),
});

export default BaseService;
