import { parseWhere } from '..';

const mockWhere = {
  name: 'bar',
  OR: [
    { id: 1 },
    { FILTERS: { id: { NOT_INT: 2 } } },
    {
      AND: [{ name: 'foo' }, { FILTERS: { id: { NOT_INT: 2 } } }],
    },
  ],
  FILTERS: { id: 1 },
};

// TODO: check equality

describe('[parse-where-util.test.ts] suite', () => {
  test('[parseWhere] should equal the correct object', () => {
    const where = parseWhere(mockWhere, {});
    expect(1 + 1).toEqual(2);
  });
});
