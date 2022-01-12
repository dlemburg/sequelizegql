import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { getAttributes } from '../services/base-service/util';
import { ModelAttribute, SchemaMapOptions } from '../../types';
import { parseWhere } from '../util';
import SequelizeGraphql from '../..';

type RecursiveInclude = {
  include: RecursiveInclude[];
  association: string;
};

type QueryAttributes = {
  include?: RecursiveInclude[];
  attributes?: string[];
  where?: Record<any, any>;
};

type BuildIncludeInput = {
  association: string;
  separate?: boolean;
} & QueryAttributes;

type FieldIntrospectionTuple = [string, any];

const BASE_ACC = () => ({ attributes: [], include: undefined });

const buildInclude = ({
  association,
  include,
  attributes = [],
  separate = false,
  where = {},
}: BuildIncludeInput) => {
  return [
    {
      association,
      attributes,
      ...(include?.length && { include }),
      ...(separate && { separate }),
      ...(Object.keys(where).length && { where }),
    },
  ];
};

const getKey = (tuple) => tuple[0];

const recurseQueryFields = (
  fieldEntries: any = [],
  modelAttributes: ModelAttribute,
  modelMapOptions: SchemaMapOptions,
  entityName: string = ''
): QueryAttributes => {
  const models = SequelizeGraphql().getSequelize().models;

  const result = fieldEntries?.reduce((acc, [key, value]: [string, any]) => {
    const associationValue = modelAttributes?.associations?.[key];
    const attributeValue = modelAttributes?.[key];
    const where = parseWhere(value?.fieldsByTypeName?.args?.where, modelMapOptions);

    if (attributeValue) {
      acc.attributes.push(key);
    }

    if (associationValue?.type) {
      const model = associationValue?.type && models?.[associationValue?.type];
      const fields = value?.fieldsByTypeName?.[associationValue?.type];
      const attributeFields = Object.entries(fields)
        .filter(([xKey, xValue]: FieldIntrospectionTuple) => {
          const result = Object.keys(xValue?.fieldsByTypeName ?? {});
          return !result?.length && !models?.[getKey(result)];
        })
        .map((x) => getKey(x));

      if (model) {
        const nextAssociationFields = Object.entries(fields).filter(([xKey, xValue]: any) => {
          const result = Object.keys(xValue?.fieldsByTypeName ?? {});
          return result?.length && models?.[getKey(result)];
        });

        const associationFields = nextAssociationFields.reduce(
          (accInner: any, x: FieldIntrospectionTuple) => {
            const fieldName = x[1].name;
            const fieldsByType = x[1].fieldsByTypeName;
            const modelName = Object.keys(x[1]?.fieldsByTypeName ?? {})?.[0];
            const nextQueryFields = Object.entries(fieldsByType[modelName]);
            const nextModelAttributes = getAttributes(models[modelName])();

            const { attributes: includeAttributes, include: associatedInclude } =
              recurseQueryFields(nextQueryFields, nextModelAttributes, modelMapOptions, fieldName);

            const baseInclude = buildInclude({
              association: fieldName,
              include: associatedInclude,
              attributes: includeAttributes,
              separate: false,
            });

            accInner.include = accInner?.include
              ? [...accInner.include, ...baseInclude]
              : baseInclude;

            return accInner;
          },
          BASE_ACC()
        );

        const where = parseWhere(value?.args?.where, modelMapOptions);

        const baseInclude = buildInclude({
          association: key,
          include: associationFields?.include,
          attributes: attributeFields,
          where,
          ...(associationValue?.separate && { separate: associationValue?.separate }),
        });
        acc.include = acc?.include ? [...acc.include, ...baseInclude] : baseInclude;
      }
    }

    return acc;
  }, BASE_ACC());

  return result;
};

export class QueryBuilder {
  public static buildQueryOptions(
    model,
    resolveInfo,
    modelMapOptions: SchemaMapOptions
  ): QueryAttributes {
    try {
      const modelAttributes = getAttributes(model)();
      const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as any;
      const info = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType
      );

      const where = parseWhere(info.args.where, modelMapOptions);
      const fields = Object.entries(info.fields);
      const { attributes, include } = recurseQueryFields(fields, modelAttributes, modelMapOptions);

      return { attributes, include, where };
    } catch (err) {
      return {};
    }
  }
}
