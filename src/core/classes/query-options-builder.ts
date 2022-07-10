import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { getAttributes } from '../services/base-service/util';
import { ModelAttribute, SchemaMapOptions } from '../../types';
import { findValueCaseInsensitive, parseWhere } from '../util';
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
  required?: boolean;
} & QueryAttributes;

type FieldIntrospectionTuple = [string, any];

const BASE_ACC = () => ({ attributes: [], include: undefined });

const buildInclude = ({
  association,
  include,
  attributes = [],
  separate = false,
  required = false,
  where = {},
}: BuildIncludeInput) => {
  return [
    {
      association,
      attributes,
      ...(include?.length && { include }),
      ...(separate && { separate }),
      ...(required && { required }),
      where,
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
    const associationValue = findValueCaseInsensitive(modelAttributes?.associations, key);
    const attributeValue = findValueCaseInsensitive(modelAttributes, key);

    if (attributeValue) {
      acc.attributes.push(key);
    }

    if (associationValue?.type) {
      const currentModel = associationValue?.type && models?.[associationValue?.type];
      const currentModelAttributes = getAttributes(currentModel)();
      const currentFields = value?.fieldsByTypeName?.[associationValue?.type];

      if (currentModel) {
        const nextAssociationFields = Object.entries(currentFields).filter(
          ([xKey, xValue]: any) => {
            const result = Object.keys(xValue?.fieldsByTypeName ?? {});
            return result?.length && models?.[getKey(result)];
          }
        );

        const associationFields = nextAssociationFields.reduce(
          (accInner: any, x: FieldIntrospectionTuple) => {
            const nextFieldName = x[1].name;
            const nextFieldsByType = x[1].fieldsByTypeName;
            const nextModelName = Object.keys(x[1]?.fieldsByTypeName ?? {})?.[0];
            const nextQueryFields = Object.entries(nextFieldsByType[nextModelName]);
            const nextModelAttributes = getAttributes(models[nextModelName])();

            const where = parseWhere(x[1]?.args?.where, modelMapOptions);
            const options = x[1]?.args?.options;
            const separate = currentModelAttributes?.associations?.[nextFieldName]?.separate;

            const { attributes: includeAttributes, include: associatedInclude } =
              recurseQueryFields(
                nextQueryFields,
                nextModelAttributes,
                modelMapOptions,
                nextFieldName
              );

            const baseInclude = buildInclude({
              association: nextFieldName,
              include: associatedInclude,
              attributes: includeAttributes,
              where,
              separate: options?.required ? false : associationValue?.separate,
              required: options?.required ?? false,
            });

            accInner.include = accInner?.include
              ? [...accInner.include, ...baseInclude]
              : baseInclude;

            return accInner;
          },
          BASE_ACC()
        );

        const where = parseWhere(value?.args?.where, modelMapOptions);
        const options = value?.args?.options;
        const attributeFields = Object.entries(currentFields)
          .filter(([xKey, xValue]: FieldIntrospectionTuple) => {
            const result = Object.keys(xValue?.fieldsByTypeName ?? {});
            return !result?.length && !models?.[getKey(result)];
          })
          .map((x) => getKey(x));

        const baseInclude = buildInclude({
          association: key,
          include: associationFields?.include,
          attributes: attributeFields,
          where,
          separate: options?.required ? false : associationValue?.separate,
          required: options?.required ?? false,
        });

        acc.include = acc?.include ? [...acc.include, ...baseInclude] : baseInclude;
      }
    }

    return acc;
  }, BASE_ACC());

  return result;
};

const getEntitiesKey = (info) => Object.keys(info.fields.entities.fieldsByTypeName)[0];
const getFields = (info) =>
  info.fields?.entities?.fieldsByTypeName
    ? Object.entries(info.fields.entities.fieldsByTypeName[getEntitiesKey(info)])
    : Object.entries(info.fields);

export class QueryBuilder {
  public static buildQueryOptions(
    model,
    resolveInfo,
    options,
    modelMapOptions: SchemaMapOptions
  ): QueryAttributes {
    try {
      const modelAttributes = getAttributes(model)();
      const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as any;
      const info: any = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        resolveInfo.returnType
      );

      const where = parseWhere(info.args.where, modelMapOptions);

      const fields = getFields(info);
      const { attributes, include } = recurseQueryFields(fields, modelAttributes, modelMapOptions);

      return { attributes, include, where };
    } catch (err) {
      return {};
    }
  }
}
