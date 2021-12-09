import { SortDirection } from '../../types';
import { buildSort, buildSortAsc, buildSortDesc } from '../sequelize-util';

describe('[sequelize-util.test.ts] suite', () => {
  test('[buildSort] should build a proper sort array', () => {
    expect(buildSort('foo', SortDirection.ASC)).toEqual(['foo', SortDirection.ASC]);
  });

  test('[buildSortAsc] should build a proper sort array', () => {
    expect(buildSortAsc('foo')).toEqual([['foo', SortDirection.ASC]]);
  });

  test('[buildSortDesc] should build a proper sort array', () => {
    expect(buildSortDesc('foo')).toEqual([['foo', SortDirection.DESC]]);
  });
});
