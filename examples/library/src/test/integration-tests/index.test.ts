import { setup } from '../config/setup';
import { cleanup } from '../config/cleanup';
import { maybePluralize } from '../../../../../src/core/util';
import { GeneratedResolverField } from '../../../../../src/types';
import { seed } from '../config/seed';
import * as BookQueryEntities from './Book/book-query';
import * as BookMutationEntities from './Book/book-mutation';

let testClient;
let sequelize;

const testEntities = [
  {
    name: 'Book',
    pluralizedUpperName: maybePluralize('Book'),
    pluralizedLowerName: maybePluralize('book'),
    queryEntities: BookQueryEntities,
    mutationEntities: BookMutationEntities,
  },
];

beforeAll(async () => {
  ({ testClient, sequelize } = await setup());
  await seed(sequelize);
});

afterAll(async () => {
  await cleanup(sequelize);
});

describe('[index.test.ts] integration tests suite', () => {
  for (let {
    name,
    pluralizedLowerName,
    pluralizedUpperName,
    queryEntities: QueryEntities,
    mutationEntities: MutationEntities,
  } of testEntities) {
    test('Model testing module', async () => {
      const createEntity = MutationEntities[GeneratedResolverField.CREATE_MUTATION];
      const updateEntity = MutationEntities[GeneratedResolverField.UPDATE_MUTATION];
      const upsertEntity = MutationEntities[GeneratedResolverField.UPSERT_MUTATION];
      const deleteEntity = MutationEntities.destroy;

      const allEntities = QueryEntities[GeneratedResolverField.FIND_ALL];
      const findOneEntity = QueryEntities[GeneratedResolverField.FIND_ONE];
      const findManyEntities = QueryEntities[GeneratedResolverField.FIND_MANY];
      const entitiesPaged = QueryEntities[GeneratedResolverField.FIND_MANY_PAGED];

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
      expect(allEntities.root().responseTruthyAssertionFn(allEntitiesResultAfterCreate)).toBeTruthy;

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
