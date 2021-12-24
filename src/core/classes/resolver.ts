import { BaseInput, GeneratedResolverField, ResolverOptions } from '../../types/types';
import { QueryAttributeBuilder } from './query-attribute';
import { BaseGql } from './base-gql';
import { buildSort } from '../../util/sequelize-util';
import { parseWhere } from '../util/parse-where-util';

const resolveQuery =
  (model, serviceMethod, resolverOptions: ResolverOptions) =>
  (_, { where, options }, context, resolveInfo) => {
    let include, attributes;
    const order =
      options?.order?.length ?? options?.order.map(({ field, dir }) => buildSort(field, dir));
    const filter = parseWhere(where, resolverOptions);

    if (resolveInfo) {
      ({ include, attributes } = QueryAttributeBuilder.build(model, resolveInfo, resolverOptions));
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
    await options?.onBeforeEveryResolve?.(...args);
    await options?.onBeforeResolve?.(...args);

    const result = await resolve(...args);

    await options?.onAfterEveryResolve?.(result, ...args);
    await options?.onAfterResolve?.(result, ...args);

    return result;
  };

class Resolver extends BaseGql {
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
      [this.resolverMap[GeneratedResolverField.FIND_MANY_PAGED].name]: middleware(
        this.options,
        async (_, { where, options }, context, resolveInfo) => {
          const result = await resolveQuery(
            this.service.getModel(),
            this.service.findAndCountAll,
            this.options
          )(_, { where, options }, context, resolveInfo);

          return { entities: result.rows, totalCount: result.count };
        }
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

export const ResolverFactory = <T = any>(input: BaseInput) => new Resolver(input);
