import { BaseInput, GeneratedResolverField, ResolverOptions } from '../../types/types';
import { QueryAttributeBuilder } from './query-attribute';
import { BaseGql } from './base-gql';
import { buildSort } from '../../util/sequelize-util';
import {
  OPERATORS_FILTERS_MAP,
  TOP_LEVEL_OPERATORS_GQL_MAP,
} from '../mappers/sequelize-gql-operators-map';
import Constants from '../constants';

const buildWhereFilters = (entries) => {
  const whereFilters = Object.entries(entries).reduce((acc2, [key, value]: any) => {
    const ops = Object.entries(value).reduce((acc3, [opKey, opValue]: any) => {
      const filterOperatorResult = OPERATORS_FILTERS_MAP[opKey]?.();
      const { op, getValue } = filterOperatorResult;

      return { ...acc3, [op]: getValue(opValue) };
    }, {});

    acc2[key] = ops;

    return acc2;
  }, {});

  return whereFilters;
};

const parseWhere = (where, resolverOptions: ResolverOptions) => {
  const whereEntries = Object.entries(where);

  if (!whereEntries?.length) return where;

  const filter = whereEntries.reduce((acc, [key, value]) => {
    const topLevelOperatorResult = TOP_LEVEL_OPERATORS_GQL_MAP[key]?.();

    if (topLevelOperatorResult) {
      const { op, getValue } = topLevelOperatorResult;

      return { ...acc, [op]: getValue(value) };
    }

    if (
      key === (resolverOptions?.fieldMappers?.FILTERS || Constants.FILTERS) &&
      Object.keys(whereEntries[key])?.length
    ) {
      const whereOperatorFilters = buildWhereFilters(whereEntries[key]);

      return { ...acc, ...whereOperatorFilters };
    }

    acc[key] = value;

    return acc;
  }, {});

  return filter;
};

const resolveQuery =
  (model, serviceMethod, resolverOptions: ResolverOptions) =>
  (_, { where, options }, context, resolveInfo) => {
    let include, attributes;
    const order =
      options?.order?.length ?? options?.order.map(({ field, dir }) => buildSort(field, dir));
    const filter = parseWhere(where, resolverOptions);

    if (resolveInfo) {
      ({ include, attributes } = QueryAttributeBuilder.build(model, resolveInfo));
    }

    return serviceMethod(filter, {
      attributes,
      include,
      ...(order && { order }),
      ...options,
    });
  };

const middleware =
  (options, resolve) =>
  async (...args) => {
    await options?.onBeforeResolve(...args);

    const result = await resolve(...args);

    await options?.onAfterResolve(result, ...args);

    return result;
  };

class ResolverService extends BaseGql {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public query() {
    return {
      [this.resolverMap[GeneratedResolverField.FIND_ONE].name]: middleware(
        this.options,
        resolveQuery(this.service.getModel(), this.service.findOne, this.options)
      ),
      [this.resolverMap[GeneratedResolverField.FIND_MANY].name]: middleware(
        this.options,
        resolveQuery(this.service.getModel(), this.service.findAll, this.options)
      ),
      [this.resolverMap[GeneratedResolverField.FIND_ALL].name]: middleware(
        this.options,
        resolveQuery(this.service.getModel(), this.service.findAll, this.options)
      ),
    };
  }

  public mutation() {
    return {
      [this.resolverMap[GeneratedResolverField.CREATE_MUTATION].name]: middleware(
        this.options,
        (_, { input }) => this.service.create(input)
      ),
      [this.resolverMap[GeneratedResolverField.CREATE_MANY_MUTATION].name]: middleware(
        this.options,
        (_, { input }) => this.service.bulkCreate(input)
      ),
      [this.resolverMap[GeneratedResolverField.UPDATE_MUTATION].name]: middleware(
        this.options,
        (_, { input, where }) => this.service.update(input, where)
      ),
      [this.resolverMap[GeneratedResolverField.UPSERT_MUTATION].name]: middleware(
        this.options,
        (_, { where, input }) => this.service.upsert(where, input)
      ),
      [this.resolverMap[GeneratedResolverField.DELETE_MUTATION].name]: middleware(
        this.options,
        (_, { where, options = {} }) => this.service.destroy(where, options)
      ),
    };
  }

  public resolversMap() {
    return {
      Query: this.query(),
      Mutation: this.mutation(),
    };
  }
}

export const ResolverFactory = <T = any>(input: BaseInput) => new ResolverService(input);
