import { BaseInput, GeneratedResolverField } from '../../types/types';
import { QueryAttributeBuilder } from './query-attribute';
import { BaseClass } from './base-class';

const resolveQuery =
  (model, serviceMethod) =>
  (_, { where }, context, resolveInfo) => {
    let include, attributes;
    if (resolveInfo) {
      ({ include, attributes } = QueryAttributeBuilder.build(model, resolveInfo));
    }

    return serviceMethod(where ?? {}, { attributes, include });
  };

class Resolver extends BaseClass {
  constructor(input: BaseInput) {
    super(input);

    return this;
  }

  public mutation() {
    return {
      [this.resolverMap[GeneratedResolverField.CREATE_MUTATION].name]: (_, { input }, context) =>
        this.service.create(input),
      [this.resolverMap[GeneratedResolverField.UPDATE_MUTATION].name]: async (
        _,
        { input, where },
        context
      ) => this.service.update(input, where),
      [this.resolverMap[GeneratedResolverField.DELETE_MUTATION].name]: (
        _,
        { where, options = {} },
        context
      ) => this.service.destroy(where, options),
      [this.resolverMap[GeneratedResolverField.UPSERT_MUTATION].name]: (
        _,
        { where, input },
        context
      ) => this.service.upsert(input, where),
    };
  }

  public query() {
    return {
      [this.resolverMap[GeneratedResolverField.FIND_ALL].name]: resolveQuery(
        this.service.getModel(),
        this.service.findAll
      ),
      [this.resolverMap[GeneratedResolverField.FIND_MANY].name]: resolveQuery(
        this.service.getModel(),
        this.service.findAll
      ),
      [this.resolverMap[GeneratedResolverField.FIND_ONE].name]: resolveQuery(
        this.service.getModel(),
        this.service.findOne
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
