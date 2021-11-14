import BaseService from '../services/base-service';
import { getResolverFieldMap } from '../core/util';
import { GeneratedResolverField } from '../types/types';
import { buildQueryAttributes } from '../util/resolver-field-util';

type BaseResolverInput<T> = {
  model;
  name?: string;
};

const resolveQueryAttributes =
  (model, serviceMethod) =>
  (_, { where }, context, resolveInfo) => {
    let include, attributes;
    if (resolveInfo) {
      ({ include, attributes } = buildQueryAttributes(model)(resolveInfo));
    }

    return serviceMethod(where ?? {}, { attributes, include });
  };

export const ResolverFactory = <T>({ model, name }: BaseResolverInput<T>) => {
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
    [resolverFieldMap[GeneratedResolverField.FIND_ALL].name]: resolveQueryAttributes(
      service.getModel(),
      service.findAll
    ),
    [resolverFieldMap[GeneratedResolverField.FIND_MANY].name]: resolveQueryAttributes(
      service.getModel(),
      service.findAll
    ),
    [resolverFieldMap[GeneratedResolverField.FIND_ONE].name]: resolveQueryAttributes(
      service.getModel(),
      service.findOne
    ),
    [resolverFieldMap[GeneratedResolverField.FIND_ALL_WITH_ASSOCIATIONS].name]: () =>
      service.findAllWithAssociations(),
    [resolverFieldMap[GeneratedResolverField.FIND_MANY_WITH_ASSOCIATIONS].name]: (_, { where }) =>
      service.findAllWithAssociations(where),
    [resolverFieldMap[GeneratedResolverField.FIND_ONE_WITH_ASSOCIATIONS].name]: (_, { where }) =>
      service.findOneWithAssociations(where),
  };

  return {
    Mutation: mutation,
    Query: query,
  };
};
