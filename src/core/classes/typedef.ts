import omit from 'lodash/omit';
import { BaseTypedefInput } from '../../types/types';
import { BaseService } from '../../services';
import { MutationFactory } from './mutation';
import { whereInputGql } from '../graphql/where-input';
import { typesGql } from '../graphql/types';
import { WhereAttributeFactory } from './where-attributes';
import { QueryFactory } from './query';

const OMIT_ATTRIBUTES = ['id', 'createdAt', 'updatedAt', 'removedAt'];

class Typedef {
  private name;
  private resolvers;
  private options;
  private model;
  private service;
  private attributes;

  constructor({ name, model, resolvers, options }: BaseTypedefInput) {
    this.model = model;
    this.service = BaseService(this.model);
    this.name = name ?? this.service?.getModelName();
    this.resolvers = resolvers;
    this.options = options;
    this.attributes = this.service?.getAttributes();

    return this;
  }

  public inputAttributes() {
    return omit(this.attributes, OMIT_ATTRIBUTES);
  }

  public typeGql() {
    return typesGql('type', this.name, this.attributes);
  }

  public inputGql() {
    return typesGql('input', `${this.name}Input`, this.inputAttributes());
  }

  public updateInputGql() {
    return typesGql('input', `Update${this.name}Input`, this.inputAttributes());
  }

  public whereInputGql() {
    return whereInputGql(this.name, this.whereAttributes());
  }

  public whereAttributes() {
    return WhereAttributeFactory(this.options?.whereAttributes, this.attributes).keyValuePairs();
  }

  public queryGql() {
    return QueryFactory({
      name: this.name,
      resolvers: this.resolvers,
      options: this.options,
    }).gql();
  }

  public mutationGql() {
    return MutationFactory({
      name: this.name,
      resolvers: this.resolvers,
      options: this.options,
    }).gql();
  }

  public typedefMap() {
    const baseType = this.typeGql();
    const baseInput = this.inputGql();
    const baseUpdateInput = this.updateInputGql();
    const baseWhereInput = this.whereInputGql();
    const baseMutation = this.mutationGql();
    const baseQuery = this.queryGql();

    return {
      baseWhereInput,
      baseMutation,
      baseQuery,
      baseType,
      baseInput,
      baseUpdateInput,
      generatedGqlTypesAndInputs: `
        ${baseType}
        ${baseInput}
        ${baseUpdateInput}
        ${baseWhereInput}
      `,
      generatedGql: `
        ${baseWhereInput}
        ${baseMutation}
        ${baseQuery}
        ${baseType}
        ${baseInput}
        ${baseUpdateInput}
      `,
    };
  }
}

export const TypedefFactory = ({
  name: serviceName,
  model,
  resolvers,
  options,
}: BaseTypedefInput) =>
  new Typedef({
    name: serviceName,
    model,
    resolvers,
    options,
  });
