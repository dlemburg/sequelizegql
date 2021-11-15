import omit from 'lodash/omit';
import { BaseTypedefInput } from '../../types/types';
import { BaseService } from '../../services';
import { MutationFactory } from './mutation';
import { whereInput } from '../graphql/where-input';
import { types } from '../graphql/types';
import { WhereAttributeFactory } from './where-attributes';
import { QueryFactory } from './query';

const OMIT_ATTRIBUTES = ['id', 'createdAt', 'updatedAt', 'removedAt'];

export const TypedefBuilder = ({
  name: serviceName,
  model,
  resolvers,
  options,
}: BaseTypedefInput) => {
  const service = BaseService(model);
  const name = serviceName ?? service?.getModelName();
  const attributes = service?.getAttributes();
  const inputAttributes = omit(attributes, OMIT_ATTRIBUTES);

  const baseType = types('type', name, attributes);
  const baseInput = types('input', `${name}Input`, inputAttributes);
  const baseUpdateInput = types('input', `Update${name}Input`, inputAttributes);

  const whereAttributes = WhereAttributeFactory(
    options?.whereAttributes,
    attributes
  ).keyValuePairs();
  const baseWhereInput = whereInput(name, whereAttributes);

  const baseMutation = MutationFactory({ name, resolvers, options }).gql();
  const baseQuery = QueryFactory({ name, resolvers, options }).gql();

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
};
