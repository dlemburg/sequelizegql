import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { getAttributes } from '../../services/base-service';
import { StateFactory } from './state';

type RecursiveInclude = {
  include: RecursiveInclude[];
  association: string;
};

type QueryAttributes = {
  include?: RecursiveInclude;
  attributes?: string[];
};

const recurseQueryFields = (fieldEntries, modelAttributes): QueryAttributes => {
  const Models = StateFactory().getModels();

  const result = (fieldEntries ?? [])?.reduce(
    (acc, [key, value]: any) => {
      const associationValue = modelAttributes?.associations?.[key];
      const attributeValue = modelAttributes?.[key];

      if (associationValue) {
        const Model = associationValue?.type && Models?.[associationValue?.type];
        const fields = value?.fieldsByTypeName?.[associationValue?.type];

        if (Model) {
          const associationFields = Object.entries(fields)
            .filter(([xKey, xValue]: any) => {
              const result = Object.keys(xValue?.fieldsByTypeName ?? {});
              const associationName = result?.[0];

              return associationName ? Models?.[associationName] : false;
            })
            .reduce(
              (acc: any, x: any) => {
                const fields = x[1];
                const args = fields?.args; // TODO: args
                const modelName = Object.keys(fields?.fieldsByTypeName ?? {})?.[0];
                const model = Models[modelName];
                const fieldEntries = [fields.name, fields];
                const { attributes, include: associatedInclude } = recurseQueryFields(
                  [fieldEntries],
                  getAttributes(model)()
                );

                const baseInclude = [
                  {
                    association: fields.name,
                    include: associatedInclude?.include ?? [],
                    where: {}, // TODO: args
                  },
                ];
                acc.attributes = attributes;
                acc.include = acc?.include ? [acc.include, ...baseInclude] : baseInclude;

                return acc;
              },
              { attributes: [], include: undefined }
            );

          const baseInclude = [
            { association: key, include: associationFields?.include ?? [], where: {} }, // TODO: args
          ];
          acc.include = acc?.include
            ? { include: [acc.include, ...baseInclude] }
            : { include: baseInclude };
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
  public static build(model, resolveInfo): QueryAttributes {
    try {
      const modelAttributes = getAttributes(model)();
      const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as any;
      const info = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType
      );

      const fields = Object.entries(info.fields);
      const { attributes, include } = recurseQueryFields(fields, modelAttributes);

      return { attributes, include };
    } catch (err) {
      return {};
    }
  }
}
