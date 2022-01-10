import omit from 'lodash/omit';
import { BaseInput, KeyedAttribute, ModelAttribute, Attribute } from '../../types';
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
import { generateEnumsGql } from '../graphql';

const buildEnums = (attributes: KeyedAttribute) => {
  return Object.entries(attributes).reduce(
    (acc: Attribute[], [key, value]: [string, Attribute]) => {
      if (value.isEnum) {
        acc.push(attributes[key]);
      }

      return acc;
    },
    []
  );
};
class Typedef extends BaseGql {
  attributes: ModelAttribute;
  omitInputAttributes: string[] | undefined;
  enums;

  constructor(input: BaseInput) {
    super(input);

    this.attributes = this.service?.getAttributes();
    this.omitInputAttributes = input.options?.omitInputAttributes;
    this.enums = buildEnums(this.attributes);

    return this;
  }

  public inputAttributes(omitInputAttributes: string[] = []) {
    return omit(this.attributes, [...(this.omitInputAttributes ?? []), ...omitInputAttributes]);
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
    return whereInputGql(this.name, this.whereInputAttributes(), this.options);
  }

  public queryGql() {
    const operations = this.getOperations('query');

    return QueryFactory().gql(operations);
  }

  public mutationGql() {
    const operations = this.getOperations('mutation');

    return MutationFactory().gql(operations);
  }

  public whereInputAttributes() {
    return WhereAttributeFactory().keyValuePairs(
      this.options?.whereInputAttributes,
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
    const enumsGql = generateEnumsGql(this.enums);

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
        ${enumsGql}
      `,
    };
  }
}

export const TypedefFactory = (input: BaseInput) => new Typedef(input);
