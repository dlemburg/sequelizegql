import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { getAttributes } from '../../services/base-service/util';
import { parseWhere } from '../util/parse-where-util';
import { StateFactory } from './state';

type RecursiveInclude = {
  include: RecursiveInclude[];
  association: string;
};

type QueryAttributes = {
  include?: RecursiveInclude[];
  attributes?: string[];
};

const recurseQueryFields = (fieldEntries, modelAttributes, resolverOptions): QueryAttributes => {
  const Models = StateFactory().getModels();

  const result = (fieldEntries ?? [])?.reduce(
    (acc, [key, value]: any) => {
      const associationValue = modelAttributes?.associations?.[key];
      const attributeValue = modelAttributes?.[key];
      const where = parseWhere(value?.fieldsByTypeName?.args?.where, resolverOptions);

      if (associationValue) {
        const Model = associationValue?.type && Models?.[associationValue?.type];
        const fields = value?.fieldsByTypeName?.[associationValue?.type];

        if (Model) {
          const associationFields = Object.entries(fields)
            .filter(([xKey, xValue]: any) => {
              const result = Object.keys(xValue?.fieldsByTypeName ?? {});
              return result?.length && Models?.[result[0]];
            })
            .reduce(
              (acc: any, x: any) => {
                const fieldName = x[1].name;
                const fieldsByType = x[1].fieldsByTypeName;
                const modelName = Object.keys(x[1]?.fieldsByTypeName ?? {})?.[0];
                const fields = fieldsByType[modelName];
                const nextFields = Object.entries(fields);
                const nextAttributes = getAttributes(Models[modelName])();

                const { attributes, include: associatedInclude } = recurseQueryFields(
                  nextFields,
                  nextAttributes,
                  resolverOptions
                );

                const baseInclude = [
                  {
                    association: fieldName,
                    ...(associatedInclude?.length && {
                      include: associatedInclude,
                    }),
                  },
                ];
                acc.attributes = attributes;
                acc.include = acc?.include ? [...acc.include, ...baseInclude] : baseInclude;

                return acc;
              },
              { attributes: [], include: undefined }
            );

          const baseInclude = [
            {
              association: key,
              ...(associationFields?.include?.length && {
                include: associationFields?.include,
              }),
            },
          ];
          acc.include = acc?.include ? [...acc.include, ...baseInclude] : baseInclude;
        }
      } else if (attributeValue) {
        acc.attributes.push(key);
      }

      return acc;
    },
    { attributes: [], include: undefined } as any
  );

  return result;
};

export class QueryAttributeBuilder {
  public static build(model, resolveInfo, resolverOptions): QueryAttributes {
    try {
      const modelAttributes = getAttributes(model)();
      const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as any;
      const info = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType
      );

      const fields = Object.entries(info.fields);
      const { attributes, include } = recurseQueryFields(fields, modelAttributes, resolverOptions);

      return { attributes, include };
    } catch (err) {
      return {};
    }
  }
}
