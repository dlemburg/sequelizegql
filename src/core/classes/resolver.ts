import { BaseService } from '../../services';
import { getResolverFieldMap } from '..';
import { GeneratedResolverField } from '../../types/types';
import { QueryAttributesBuilder } from './query-attribute';

type BaseResolverInput<T> = {
  model;
  name?: string;
};

const resolveQuery =
  (model, serviceMethod) =>
  (_, { where }, context, resolveInfo) => {
    let include, attributes;
    if (resolveInfo) {
      ({ include, attributes } = QueryAttributesBuilder(model)(resolveInfo));
    }

    return serviceMethod(where ?? {}, { attributes, include });
  };

export const ResolverBuilder = <T>({ model, name }: BaseResolverInput<T>) => {
  const service = BaseService(model);

  name = name ?? service.getModelName();
  const resolverFieldMap = getResolverFieldMap(name);

  const mutation = {
    [resolverFieldMap[GeneratedResolverField.CREATE_MUTATION].name]: (_, { input }, context) =>
      service.create(input),
    [resolverFieldMap[GeneratedResolverField.UPDATE_MUTATION].name]: async (
      _,
      { input, where },
      context
    ) => service.update(input, where),
    [resolverFieldMap[GeneratedResolverField.DELETE_MUTATION].name]: (
      _,
      { where, options = {} },
      context
    ) => service.destroy(where, options),
    [resolverFieldMap[GeneratedResolverField.UPSERT_MUTATION].name]: (
      _,
      { where, input },
      context
    ) => service.upsert(input, where),
  };

  const query = {
    [resolverFieldMap[GeneratedResolverField.FIND_ALL].name]: resolveQuery(
      service.getModel(),
      service.findAll
    ),
    [resolverFieldMap[GeneratedResolverField.FIND_MANY].name]: resolveQuery(
      service.getModel(),
      service.findAll
    ),
    [resolverFieldMap[GeneratedResolverField.FIND_ONE].name]: resolveQuery(
      service.getModel(),
      service.findOne
    ),
  };

  return {
    Mutation: mutation,
    Query: query,
  };
};
