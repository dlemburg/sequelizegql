import { gql } from 'apollo-server-core';
import { merge } from 'lodash';
import Bluebird from 'bluebird';

export const buildGql = (value) =>
  gql`
    ${value}
  `;

export const buildSchema = async ({ models: Models }) => {
  const result = await Bluebird.reduce(
    [...Object.keys(Models), 'Health'],
    async (acc, name) => {
      try {
        const exports = await import(`./custom/${name}`);

        if (exports?.schemaMap) {
          acc.schemaMap = merge(acc.schemaMap, exports?.schemaMap);
        }

        if (exports?.resolvers) {
          acc.resolvers = merge(acc.resolvers, exports?.resolvers);
        }

        if (exports?.typedefs) {
          acc.typedefs = [...acc.typedefs, exports?.typedefs];
        }

        return acc;
      } catch {
        return acc;
      }
    },
    { schemaMap: {}, resolvers: {}, typedefs: [] }
  );

  return result;
};
