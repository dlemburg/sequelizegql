import { setup } from '../config/setup';
import { cleanup } from '../config/cleanup';
import { maybePluralize } from '../../../../../src/core/util';
import * as BookQueryEntities from './Book/book-query';
import * as BookMutationEntities from './Book/book-mutation';

let testClient;
let sequelize;

beforeAll(async () => {
  ({ testClient, sequelize } = await setup());
});

afterAll(async () => {
  await cleanup(sequelize);
});

const testEntities = [
  {
    name: 'Book',
    loweredName: 'book',
    pluralizedUpperName: maybePluralize('Book'),
    pluralizedLowerName: maybePluralize('book'),
    queryEntities: BookQueryEntities,
    mutationEntities: BookMutationEntities,
  },
];

describe('[index.test.ts] integration tests suite', () => {
  for (let {
    name,
    loweredName,
    pluralizedLowerName,
    pluralizedUpperName,
    queryEntities: QueryEntities,
    mutationEntities: MutationEntities,
  } of testEntities) {
    test('Model testing module', async () => {
      const createEntity = MutationEntities[`create${name}`];
      const updateEntity = MutationEntities[`update${name}`];
      const upsertEntity = MutationEntities[`upsert${name}`];
      const deleteEntity = MutationEntities[`delete${name}`];

      const allEntities = QueryEntities[`all${pluralizedUpperName}`];
      const findOneEntity = QueryEntities[loweredName];
      const findManyEntities = QueryEntities[`${pluralizedLowerName}`];
      const entitiesPaged = QueryEntities[`${pluralizedLowerName}Paged`];

      // create
      const {
        query: createEntityQuery,
        body: createEntityBody,
        response: createEntityResponse,
      } = createEntity.root();
      const createEntityResult: any = await testClient.mutate(createEntityQuery, {
        variables: createEntityBody,
      });
      const createEntityId = createEntityResult.data[`create${name}`].id;
      delete createEntityResult.data[`create${name}`].id;
      expect(createEntityResult).toEqual(createEntityResponse);

      // allEntities
      const allEntitiesResultAfterCreate: any = await testClient.query(allEntities.root().query, {
        variables: allEntities.root().body,
      });
      expect(allEntitiesResultAfterCreate.data[`all${pluralizedUpperName}`].length).toEqual(1);

      // findOne
      const {
        query: entityQuery,
        body: entityBody,
        response: entityResponse,
      } = findOneEntity.root(createEntityId);
      const entityResultAfterCreate: any = await testClient.query(entityQuery, {
        variables: entityBody,
      });
      expect(entityResultAfterCreate.data).toEqual(entityResponse);

      // findMany
      const {
        query: findManyEntitiesQuery,
        body: findManyEntitiesBody,
        responseTruthyAssertionFn: entitiesResponseTruthyAssertionFn,
      } = findManyEntities.root(createEntityId);
      const entitiesResultAfterCreate: any = await testClient.query(findManyEntitiesQuery, {
        variables: findManyEntitiesBody,
      });
      const entitiesTruthy = entitiesResponseTruthyAssertionFn?.(
        entitiesResultAfterCreate.data[`${pluralizedLowerName}`]
      );
      expect(entitiesTruthy).toBeTruthy();

      // entitiesPaged
      const {
        query: entitiesPagedQuery,
        body: entitiesPagedBody,
        responseTruthyAssertionFn: entitiesPagedResponseTruthyAssertionFn,
      } = entitiesPaged.root();
      const entitiesPagedResultAfterCreate: any = await testClient.query(entitiesPagedQuery, {
        variables: entitiesPagedBody,
      });
      const entitiesPagedTruthy = entitiesPagedResponseTruthyAssertionFn?.(
        entitiesPagedResultAfterCreate.data[`${pluralizedLowerName}Paged`]
      );
      expect(entitiesPagedTruthy).toBeTruthy();

      // update
      const {
        query: updateEntityQuery,
        body: updateEntityBody,
        response: updateEntityResponse,
      } = updateEntity.root();
      const updateEntityResult: any = await testClient.mutate(updateEntityQuery, {
        variables: updateEntityBody,
      });
      expect(updateEntityResult).toEqual(updateEntityResponse);

      // upsert
      const {
        query: upsertEntityQuery,
        body: upsertEntityBody,
        response: upsertEntityResponse,
      } = upsertEntity.root();
      const upsertEntityResult: any = await testClient.mutate(upsertEntityQuery, {
        variables: upsertEntityBody,
      });
      expect(upsertEntityResult).toEqual(upsertEntityResponse);

      // delete
      const {
        query: deleteEntityQuery,
        body: deleteEntityBody,
        response: deleteEntityResponse,
      } = deleteEntity.root(createEntityId);
      const deleteEntityResult: any = await testClient.mutate(deleteEntityQuery, {
        variables: deleteEntityBody,
      });
      expect(deleteEntityResult).toEqual(deleteEntityResponse);
    });
  }
});
