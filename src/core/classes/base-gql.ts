import { Model } from 'sequelize';
import { BaseService, BaseServiceInterface } from '../services';
import { BaseInput, ResolverFieldMap, SchemaMapOptions } from '../../types';
import { argsGql, newLine } from '../graphql';
import {
  getMutationResolverFieldMap,
  getQueryResolverFieldMap,
  getResolverFieldMap,
} from '../mappers';
import { maybeGenerate } from '../util/generate';

export class BaseGql {
  public name: string;
  public options: SchemaMapOptions;
  public resolverMap: ResolverFieldMap;
  public queryResolverMap: ResolverFieldMap;
  public mutationResolverMap: ResolverFieldMap;
  public model: Model<any, any>;
  public service: BaseServiceInterface<any>;

  constructor(input: BaseInput) {
    this.model = input.model;
    this.service = BaseService(input.model);
    this.name = this.service.getModelName();
    this.options = input.options ?? {};
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
      const resolverDirective =
        this.options?.directive ?? this.options?.[resolverKey]?.directive ?? '';

      if (!maybeGenerate(this.options, resolverKey)) {
        return acc;
      }

      const result = `${resolverName}${resolverArgs}: ${
        value.returnType
      } ${resolverDirective}${newLine()}`;

      return acc + result;
    }, '');

    return operations;
  };
}
