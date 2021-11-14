import { v4 as uuidv4 } from 'uuid';

export const buildSortDesc = (field) => [[field, 'DESC']];
export const buildSortAsc = (field) => [[field, 'ASC']];

export const makeId = () => uuidv4();
