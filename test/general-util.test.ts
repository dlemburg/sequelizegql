import { lowercaseFirstLetter } from '../src/core/util';

describe('[general-util.test.ts] suite', () => {
  test('[lowercaseFirstLetter] should lowercase first letter', () => {
    expect(lowercaseFirstLetter('User')).toEqual('user');
  });
});
