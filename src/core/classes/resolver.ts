import { BaseService } from '../../services';
import { GeneratedResolverField } from '../../types/types';
import { getResolverFieldMap } from '../mappers';
import { QueryAttributeBuilder } from './query-attribute';

type BaseResolverInput<T> = {
  model;
  name?: string;
};

const resolveQuery =
  (model, serviceMethod) =>
  (_, { where }, context, resolveInfo) => {
    let include, attributes;
    if (resolveInfo) {
      ({ include, attributes } = QueryAttributeBuilder.build(model, resolveInfo));
    }

    return serviceMethod(where ?? {}, { attributes, include });
  };
class Resolver<T> {
  private name;
  private model;
  private service;
  private resolverFieldMap;

  constructor({ name, model }: BaseResolverInput<T>) {
    this.model = model;
    this.service = BaseService(this.model);
    this.name = name ?? this.service.getModelName();
    this.resolverFieldMap = getResolverFieldMap(this.name);

    return this;
  }

  public mutation() {
    return {
      [this.resolverFieldMap[GeneratedResolverField.CREATE_MUTATION].name]: (
        _,
        { input },
        context
      ) => this.service.create(input),
      [this.resolverFieldMap[GeneratedResolverField.UPDATE_MUTATION].name]: async (
        _,
        { input, where },
        context
      ) => this.service.update(input, where),
      [this.resolverFieldMap[GeneratedResolverField.DELETE_MUTATION].name]: (
        _,
        { where, options = {} },
        context
      ) => this.service.destroy(where, options),
      [this.resolverFieldMap[GeneratedResolverField.UPSERT_MUTATION].name]: (
        _,
        { where, input },
        context
      ) => this.service.upsert(input, where),
    };
  }

  public query() {
    return {
      [this.resolverFieldMap[GeneratedResolverField.FIND_ALL].name]: resolveQuery(
        this.service.getModel(),
        this.service.findAll
      ),
      [this.resolverFieldMap[GeneratedResolverField.FIND_MANY].name]: resolveQuery(
        this.service.getModel(),
        this.service.findAll
      ),
      [this.resolverFieldMap[GeneratedResolverField.FIND_ONE].name]: resolveQuery(
        this.service.getModel(),
        this.service.findOne
      ),
    };
  }

  public resolvers() {
    return {
      Query: this.query(),
      Mutation: this.mutation(),
    };
  }
}

export const ResolverFactory = <T>({ name, model }: BaseResolverInput<T>) =>
  new Resolver<T>({ name, model });
