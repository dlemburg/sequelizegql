import { BaseService, BaseServiceInterface } from '../../services';
import { BaseInput } from '../../types';
import { argsGql, newLine } from '../graphql';
import { getResolverFieldMap } from '../mappers';

export class BaseGql {
  public name;
  public resolvers;
  public options;
  public resolverMap;
  public model;
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

  public getOperations = () => {
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
        this.resolvers[resolverKey]?.directive ?? this.options?.baseDirective ?? ''
      }`;

      return acc + result + newLine();
    }, '');

    return operations;
  };
}
