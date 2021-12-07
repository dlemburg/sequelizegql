import { buildSort, buildSortAsc, buildSortDesc } from './sequelize-util';

test('[buildSort] should build a proper sort array', () => {
  expect(buildSort('foo', 'ASC')).toEqual(['foo', 'ASC']);
});

test('[buildSortAsc] should build a proper sort array', () => {
  expect(buildSortAsc('foo')).toEqual([['foo', 'ASC']]);
});

test('[buildSortDesc] should build a proper sort array', () => {
  expect(buildSortDesc('foo')).toEqual([['foo', 'DESC']]);
});
