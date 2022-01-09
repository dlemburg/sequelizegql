import omit from 'lodash/omit';
import { BaseTestFactoryInput, GeneratedResolverField } from '../../types';
import { BaseService } from '../services';
import { buildTests } from '../util/testing-util';

export const OMIT_ATTRIBUTES = ['id', 'createdAt', 'updatedAt', 'removedAt'];

export const TestFactory = ({ model, resolvers, variables = {} }: BaseTestFactoryInput) => {
  const service = BaseService(model);
  const attributes = service?.getAttributes();
  const name = service?.getModelName();
  const inputAttributes = omit(attributes, OMIT_ATTRIBUTES);
  const tests = buildTests({
    name,
    resolvers,
    inputAttributes,
    attributes,
    variables,
  });

  return tests;
};

export const runTestSuite = async (tests, { expect, ...Op }) => {
  const starterTest = tests.find((x) => x.key === GeneratedResolverField.CREATE_MUTATION);
  const deleteTest = tests.find((x) => x.key === GeneratedResolverField.DELETE_MUTATION);
  const dependencyTests = tests.filter(
    (x) =>
      x.key !== GeneratedResolverField.CREATE_MUTATION &&
      x.key !== GeneratedResolverField.DELETE_MUTATION
  );

  const starterResult = await Op.mutation(starterTest.body, {
    variables: starterTest.variables,
  });

  expect(starterResult?.errors).toBeUndefined();

  const baseEntity = starterResult?.data?.[starterTest.name];

  expect(baseEntity).toBeDefined();
  expect(baseEntity.id).not.toBeNaN();

  const baseId = baseEntity.id;

  // expect(baseEntity).toEqual({ id: starterId, ...starterTest.variables.input });

  for (let x of dependencyTests) {
    const { name, body, operationType, variables } = x;

    if (variables.hasOwnProperty('where')) variables.where = { id: baseId };

    const result = await Op[operationType](body, { variables });

    expect(result?.errors).toBeUndefined();

    const resultData = result?.data?.[name] ?? result?.data;

    if (Array.isArray(resultData)) {
      expect(resultData.length).toBeGreaterThanOrEqual(1);

      const originalEntity = resultData.find((x) => x.id === baseId);

      // TODO: this can be improved
      expect(originalEntity.id).toEqual(baseEntity.id);
    } else {
      // TODO: this can be improved
      expect(resultData.id).toEqual(baseEntity.id);
    }

    return { name, body, operationType, variables, result };
  }

  const deleteResult = await Op.mutation(deleteTest.body, {
    variables: { where: { id: baseEntity.id }, options: { force: true } },
  });

  expect(deleteResult?.errors).toBeUndefined();
  expect(+deleteResult?.data?.[deleteTest.name]?.id).toEqual(baseEntity.id);

  return;
};
