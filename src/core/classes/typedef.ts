import omit from 'lodash/omit';
import { BaseInput } from '../../types/types';
import { MutationFactory } from './mutation';
import { whereInputGql } from '../graphql/where-input';
import {
  typesGql,
  typeGql,
  inputGql,
  updateInputGqlBuilder,
  inputGqlBuilder,
} from '../graphql/types';
import { WhereAttributeFactory } from './where-attributes';
import { QueryFactory } from './query';
import { BaseGql } from './base-gql';

class Typedef extends BaseGql {
  attributes;
  omitAttributes;

  constructor(input: BaseInput) {
    super(input);

    this.attributes = this.service?.getAttributes();
    this.omitAttributes = input.options?.omitAttributes;

    return this;
  }

  public inputAttributes() {
    return omit(this.attributes, this.omitAttributes);
  }

  public typeGql() {
    return typesGql(typeGql(), this.name, this.attributes);
  }

  public inputGql() {
    return typesGql(inputGql(), inputGqlBuilder(this.name), this.inputAttributes());
  }

  public updateInputGql() {
    return typesGql(inputGql(), updateInputGqlBuilder(this.name), this.inputAttributes());
  }

  public whereInputGql() {
    return whereInputGql(this.name, this.whereAttributes());
  }

  public queryGql() {
    return QueryFactory({
      model: this.model,
      resolvers: this.resolvers,
      options: this.options,
    }).gql();
  }

  public mutationGql() {
    return MutationFactory({
      model: this.model,
      resolvers: this.resolvers,
      options: this.options,
    }).gql();
  }

  public whereAttributes() {
    return WhereAttributeFactory(this.options?.whereAttributes, this.attributes).keyValuePairs();
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

export const TypedefFactory = (input: BaseInput) => new Typedef(input);
