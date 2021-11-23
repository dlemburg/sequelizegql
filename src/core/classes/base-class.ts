import { BaseService } from '../../services';
import { BaseInput } from '../../types';
import { getResolverFieldMap } from '../mappers';

export class BaseClass {
  public name;
  public resolvers;
  public options;
  public resolverMap;
  public model;
  public service;

  constructor({ model, resolvers = {}, options = {} }: BaseInput) {
    this.model = model;
    this.service = BaseService(model);
    this.name = this.service.getModelName();
    this.resolvers = resolvers;
    this.options = options;
    this.resolverMap = getResolverFieldMap(this.name);

    return this;
  }
}
