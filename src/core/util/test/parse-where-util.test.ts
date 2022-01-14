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

const expectedParsedWhereResult = {
  name: 'bar',
  id: 1,
  [Symbol('or')]: [
    { id: 1 },
    { id: { [Symbol('not')]: 2 } },
    { [Symbol('and')]: [{ name: 'foo' }, { id: { [Symbol('not')]: 2 } }] },
  ],
};

describe('[parse-where-util.test.ts] suite', () => {
  test('[parseWhere] should equal the correct object', () => {
    const where = parseWhere(mockWhere, {});
    expect(JSON.stringify(where)).toEqual(JSON.stringify(expectedParsedWhereResult));
  });
});
