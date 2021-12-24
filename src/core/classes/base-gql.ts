import { Model } from 'sequelize';
import { BaseService, BaseServiceInterface } from '../../services';
import {
  BaseInput,
  Resolver,
  ResolverFieldMap,
  ResolverOptions,
  RESOLVER_MAP_KEYS,
  RESOLVER_MUTATION_MAP_KEYS,
  RESOLVER_QUERY_MAP_KEYS,
} from '../../types';
import { argsGql, newLine } from '../graphql';
import { getMutationResolverFieldMap, getQueryResolverFieldMap, getResolverFieldMap } from '../mappers';

export class BaseGql {
  public name: string;
  public resolvers: Resolver;
  public options: ResolverOptions;
  public resolverMap: ResolverFieldMap<typeof RESOLVER_MAP_KEYS>;
  public queryResolverMap: ResolverFieldMap<typeof RESOLVER_QUERY_MAP_KEYS>;
  public mutationResolverMap: ResolverFieldMap<typeof RESOLVER_MUTATION_MAP_KEYS>;
  public model: Model<any, any>;
  public service: BaseServiceInterface<any>;

  constructor({ model, resolvers = {}, options = {} }: BaseInput) {
    this.model = model;
    this.service = BaseService(model);
    this.name = this.service.getModelName();
    this.resolvers = resolvers;
    this.options = options;
    this.resolverMap = getResolverFieldMap(this.name, this.options);
    this.queryResolverMap = getQueryResolverFieldMap(this.name, this.options);
    this.mutationResolverMap = getMutationResolverFieldMap(this.name, this.options);

    return this;
  }

  public getOperations = (type: 'query' | 'mutation'): string => {
    const resolverMap = type === 'query' ? this.queryResolverMap : this.mutationResolverMap;

    const operations = Object.entries(resolverMap).reduce((acc, [key, value]: any) => {
      const { key: resolverKey, name: resolverName } = value;
      const resolverArgs = argsGql(value.args);
      const resolverDirective = this.options?.directive ?? this.resolvers[resolverKey]?.directive ?? '';

      if (
        this.resolvers[resolverKey]?.generate === false ||
        this.options?.omitResolvers?.includes(resolverKey)
      ) {
        return acc;
      }

      const result = `${resolverName}${resolverArgs}: ${value.returnType} ${resolverDirective}${newLine()}`;

      return acc + result;
    }, '');

    return operations;
  };
}
