import { lowercaseFirstLetter } from '../general-util';

test('[lowercaseFirstLetter] should lowercase first letter', () => {
  expect(lowercaseFirstLetter('User')).toEqual('user');
});
