import { v4 as uuidv4 } from 'uuid';
import { SortDirection } from '../../types';

type MultiDimensionalSortDesc = [[string, SortDirection.DESC]];
type MultiDimensionalSortAsc = [[string, SortDirection.ASC]];

export const buildSortDesc = (field: string): MultiDimensionalSortDesc => [
  [field, SortDirection.DESC],
];
export const buildSortAsc = (field: string): MultiDimensionalSortAsc => [
  [field, SortDirection.ASC],
];
export const buildSort = (field: string, dir: SortDirection) => [field, dir];

export const makeId = () => uuidv4();
