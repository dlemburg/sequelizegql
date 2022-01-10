import { BaseInput, GeneratedResolverField, SchemaMapOptions } from '../../types';
import { QueryAttributeBuilder } from './query-attribute';
import { BaseGql } from './base-gql';
import { buildSort, parseWhere, maybeGenerate } from '../util';

const resolveQuery =
  (model, serviceMethod, modelMapOptions: SchemaMapOptions) =>
  (_, { where, options }, context, resolveInfo) => {
    let include, attributes;
    const order =
      options?.order?.length ?? options?.order.map(({ field, dir }) => buildSort(field, dir));
    const filter = parseWhere(where, modelMapOptions);

    if (resolveInfo) {
      ({ include, attributes } = QueryAttributeBuilder.build(model, resolveInfo, modelMapOptions));
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
    await options?.onBeforeResolve?.(...args);

    const result = await resolve(...args);

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
      ...(maybeGenerate(this.options, GeneratedResolverField.FIND_ONE) && {
        [this.resolverMap[GeneratedResolverField.FIND_ONE].name]: middleware(
          this.options,
          resolveQuery(this.service.getModel(), this.service.findOne, this.options)
        ),
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.FIND_MANY) && {
        [this.resolverMap[GeneratedResolverField.FIND_MANY].name]: middleware(
          this.options,
          resolveQuery(this.service.getModel(), this.service.findAll, this.options)
        ),
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.FIND_MANY_PAGED) && {
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
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.FIND_ALL) && {
        [this.resolverMap[GeneratedResolverField.FIND_ALL].name]: middleware(
          this.options,
          resolveQuery(this.service.getModel(), this.service.findAll, this.options)
        ),
      }),
    };
  }

  public mutation() {
    return {
      ...(maybeGenerate(this.options, GeneratedResolverField.CREATE_MUTATION) && {
        [this.resolverMap[GeneratedResolverField.CREATE_MUTATION].name]: middleware(
          this.options,
          (_, { input }) => this.service.create(input)
        ),
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.CREATE_MANY_MUTATION) && {
        [this.resolverMap[GeneratedResolverField.CREATE_MANY_MUTATION].name]: middleware(
          this.options,
          (_, { input }) => this.service.bulkCreate(input)
        ),
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.UPDATE_MUTATION) && {
        [this.resolverMap[GeneratedResolverField.UPDATE_MUTATION].name]: middleware(
          this.options,
          (_, { input, where }) => this.service.update(input, where)
        ),
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.UPSERT_MUTATION) && {
        [this.resolverMap[GeneratedResolverField.UPSERT_MUTATION].name]: middleware(
          this.options,
          (_, { where, input }) => this.service.upsert(where, input)
        ),
      }),
      ...(maybeGenerate(this.options, GeneratedResolverField.DELETE_MUTATION) && {
        [this.resolverMap[GeneratedResolverField.DELETE_MUTATION].name]: middleware(
          this.options,
          async (_, { where, options = {} }) => {
            const result = await this.service.destroy(where, options);

            return result;
          }
        ),
      }),
    };
  }

  public resolversMap() {
    const result = {
      Query: this.query(),
      Mutation: this.mutation(),
    };

    return result;
  }
}

export const ResolverFactory = (input: BaseInput) => new Resolver(input);
