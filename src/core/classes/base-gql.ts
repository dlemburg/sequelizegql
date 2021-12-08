import { Model } from 'sequelize';
import { BaseService, BaseServiceInterface } from '../../services';
import {
  BaseInput,
  Resolver,
  ResolverFieldMap,
  ResolverOptions,
  RESOLVER_MAP_KEYS,
} from '../../types';
import { argsGql, newLine } from '../graphql';
import { getResolverFieldMap } from '../mappers';

export class BaseGql {
  public name: string;
  public resolvers: Resolver;
  public options: ResolverOptions;
  public resolverMap: ResolverFieldMap<typeof RESOLVER_MAP_KEYS>;
  public model: Model<any, any>;
  public service: BaseServiceInterface<any>;

  constructor({ model, resolvers = {}, options = {} }: BaseInput) {
    this.model = model;
    this.service = BaseService(model);
    this.name = this.service.getModelName();
    this.resolvers = resolvers;
    this.options = options;
    this.resolverMap = getResolverFieldMap(this.name, this.options);

    return this;
  }

  public getOperations = (): string => {
    const operations = Object.entries(this.resolverMap).reduce((acc, [key, value]: any) => {
      const argsValue = argsGql(value.args);
      const resolverKey = value.key;

      if (
        this.resolvers[resolverKey]?.generate === false ||
        this.options?.omitResolvers?.includes(resolverKey)
      ) {
        return acc;
      }

      const result = `${resolverKey}${argsValue}: ${value.returnType} ${
        this.resolvers[resolverKey]?.directive ?? this.options?.directive ?? ''
      }`;

      return acc + result + newLine();
    }, '');

    return operations;
  };
}
