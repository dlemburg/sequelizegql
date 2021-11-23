import merge from 'lodash/merge';
import { SchemaMap, ResolverOptions } from '../types';
import { buildEnums } from '../util/array-util';
import { ResolverFactory, TypedefFactory } from './classes';
import { generateEnumsGql } from './util/enum-util';

type BuildSchemaOptions = {
  schemaMap?: SchemaMap;
  options?: ResolverOptions;
};

type BuildSchemaResponse = {
  typedefs: string;
  resolvers: any;
};

// const base = {
//   find: {
//     generate: false
//   },
//   findAll: {
//     generate: false
//   },
// }
// const schemaMap = {
//   Book: {
//     options: {
//       omitAttributes: ['removedAt', 'cost']
//     },
//     resolvers: {
//       ...base,
//       create: {

//       },
//       update: {

//       }
//     }
//   },
//   Author: {
//     resolvers: {
//       ...base,
//       create: {
//         generate: false
//       },
//       update: {

//       }
//     }
//   }
// }

// const input = {
//   schemaMap,
//   options: {
//     omitAttributes: ['removedAt']
//   }
// }

const STARTER_ACC = { typedefs: '', resolvers: {} };

export const buildSchema = (
  models: any,
  enums: any,
  schemaOptions: BuildSchemaOptions
): BuildSchemaResponse => {
  const enumGql = generateEnumsGql(buildEnums(enums));
  const result: any = Object.values(models as any).reduce((acc: any, model: any): any => {
    const modelOverrides = schemaOptions?.schemaMap?.[model.name];
    const options = { ...schemaOptions?.options, ...modelOverrides?.options };

    if (options?.generate === false) return acc;

    const { generatedGql } = TypedefFactory({
      model,
      options,
    }).typedefMap();
    const resolvers = ResolverFactory({ model, options }).resolvers();

    acc.typedefs = acc.typedefs + generatedGql;
    acc.resolvers = merge(acc.resolvers, resolvers);

    // for (let x of options?.omitResolvers ?? []) {
    //   delete acc.resolvers[x];
    // }

    return acc;
  }, STARTER_ACC);

  result.typedefs = result.typedefs + enumGql;

  return result;
};
