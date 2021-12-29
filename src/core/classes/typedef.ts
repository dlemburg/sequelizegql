import omit from 'lodash/omit';
import { BaseInput, ModelAttributes } from '../../types/types';
import { MutationFactory } from './mutation';
import { whereInputGql } from '../graphql/where-input';
import {
  typesGql,
  typeGql,
  inputGql,
  updateInputNameGql,
  inputNameGql,
  pagedTypeGql,
} from '../graphql/types';
import { WhereAttributeFactory } from './where-attributes';
import { QueryFactory } from './query';
import { BaseGql } from './base-gql';

class Typedef extends BaseGql {
  attributes: ModelAttributes;
  omitAttributes: string[] | undefined;

  constructor(input: BaseInput) {
    super(input);

    this.attributes = this.service?.getAttributes();
    this.omitAttributes = input.options?.omitAttributes;

    return this;
  }

  public inputAttributes(omitAttributes: string[] = []) {
    return omit(this.attributes, [...(this.omitAttributes ?? []), ...omitAttributes]);
  }

  public typeGql() {
    return typesGql(typeGql(), this.name, this.attributes);
  }

  public inputGql() {
    return typesGql(inputGql(), inputNameGql(this.name), this.inputAttributes());
  }

  public pagedTypeGql() {
    return pagedTypeGql(this.name);
  }

  public updateInputGql() {
    return typesGql(
      inputGql(),
      updateInputNameGql(this.name),
      this.inputAttributes(['associations'])
    );
  }

  public whereInputGql() {
    return whereInputGql(this.name, this.whereAttributes(), this.options);
  }

  public queryGql() {
    const operations = this.getOperations('query');

    return QueryFactory().gql(operations);
  }

  public mutationGql() {
    const operations = this.getOperations('mutation');

    return MutationFactory().gql(operations);
  }

  public whereAttributes() {
    return WhereAttributeFactory().keyValuePairs(
      this.options?.whereAttributes,
      this.inputAttributes(['associations'])
    );
  }

  public typedefMap() {
    const baseType = this.typeGql();
    const baseInput = this.inputGql();
    const basePagedType = this.pagedTypeGql();
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
      basePagedType,
      generatedGqlTypesAndInputs: `
        ${baseType}
        ${baseInput}
        ${baseUpdateInput}
        ${baseWhereInput}
        ${basePagedType}
      `,
      generatedGql: `
        ${baseWhereInput}
        ${baseMutation}
        ${baseQuery}
        ${baseType}
        ${baseInput}
        ${baseUpdateInput}
        ${basePagedType}
      `,
    };
  }
}

export const TypedefFactory = (input: BaseInput) => new Typedef(input);
