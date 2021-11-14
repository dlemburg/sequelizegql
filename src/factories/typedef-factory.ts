import omit from 'lodash/omit';
import {
  buildGraphqlSequelizeMappings,
  buildWhereInput,
  buildMutations,
  buildQuery,
  OMIT_ATTRIBUTES,
  buildWhereAttributes,
} from '../core/util';
import { BaseTypedefInput } from '../types/types';
import { BaseService } from '../services';

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

  const baseType = buildGraphqlSequelizeMappings('type', name, attributes);
  const baseInput = buildGraphqlSequelizeMappings('input', `${name}Input`, inputAttributes);
  const baseUpdateInput = buildGraphqlSequelizeMappings(
    'input',
    `Update${name}Input`,
    inputAttributes
  );

  const whereAttributes = buildWhereAttributes(options?.whereAttributes, attributes);
  const baseWhereInput = buildWhereInput(name, whereAttributes);

  const { mutationGql } = buildMutations({ name, resolvers, options });
  const { queryGql } = buildQuery({ name, resolvers, options });

  return {
    baseWhereInput,
    baseMutation: mutationGql,
    baseQuery: queryGql,
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
      ${mutationGql}
      ${queryGql}
      ${baseType}
      ${baseInput}
      ${baseUpdateInput}
    `,
  };
};
