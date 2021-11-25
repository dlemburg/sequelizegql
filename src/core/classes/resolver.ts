import { BaseInput, GeneratedResolverField } from '../../types/types';
import { QueryAttributeBuilder } from './query-attribute';
import { BaseClass } from './base-class';
import { buildSort } from '../../util/sequelize-util';

const resolveQuery =
  (model, serviceMethod) =>
  (_, { where, options }, context, resolveInfo) => {
    let include, attributes;
    const order =
      options?.order?.length ?? options?.order.map(({ field, dir }) => buildSort(field, dir));

    if (resolveInfo) {
      ({ include, attributes } = QueryAttributeBuilder.build(model, resolveInfo));
    }

    return serviceMethod(where ?? {}, { attributes, include, ...(order && { order }), ...options });
  };

const middleware =
  (options, resolve) =>
  async (...args) => {
    await options?.onBeforeResolve(...args);

    const result = await resolve(...args);

    await options?.onAfterResolve(result, ...args);

    return result;
  };

class Resolver extends BaseClass {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public query() {
    return {
      [this.resolverMap[GeneratedResolverField.FIND_ONE].name]: middleware(
        this.options,
        resolveQuery(this.service.getModel(), this.service.findOne)
      ),
      [this.resolverMap[GeneratedResolverField.FIND_MANY].name]: middleware(
        this.options,
        resolveQuery(this.service.getModel(), this.service.findAll)
      ),
      [this.resolverMap[GeneratedResolverField.FIND_ALL].name]: middleware(
        this.options,
        resolveQuery(this.service.getModel(), this.service.findAll)
      ),
    };
  }

  public mutation() {
    return {
      [this.resolverMap[GeneratedResolverField.CREATE_MUTATION].name]: middleware(
        this.options,
        (_, { input }) => this.service.create(input)
      ),
      [this.resolverMap[GeneratedResolverField.UPDATE_MUTATION].name]: middleware(
        this.options,
        (_, { input, where }) => this.service.update(input, where)
      ),
      [this.resolverMap[GeneratedResolverField.DELETE_MUTATION].name]: middleware(
        this.options,
        (_, { where, options = {} }) => this.service.destroy(where, options)
      ),
      [this.resolverMap[GeneratedResolverField.UPSERT_MUTATION].name]: middleware(
        this.options,
        (_, { where, input }) => this.service.upsert(where, input)
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
