import omit from 'lodash/omit';
import { BaseTypedefInput } from '../../types/types';
import { BaseService } from '../../services';
import { QueryBuilder } from './query';
import { MutationBuilder } from './mutation';
import { whereInput } from '../graphql/where-input';
import { types } from '../graphql/types';
import { WhereAttributesBuilder } from './where-attributes';

export const OMIT_ATTRIBUTES = ['id', 'createdAt', 'updatedAt', 'removedAt'];

export const TypedefFactory = ({
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

  const whereAttributes = WhereAttributesBuilder(options?.whereAttributes, attributes);
  const baseWhereInput = whereInput(name, whereAttributes);

  const { gql: baseMutation } = MutationBuilder({ name, resolvers, options });
  const { gql: baseQuery } = QueryBuilder({ name, resolvers, options });

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
