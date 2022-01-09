import { buildEnums, enumToArray } from '../enum-util';

enum Foo {
  BAR = 'BAR',
  BAZ = 'BAZ',
}

enum Starter {
  HELLO = 'HELLO',
  WORLD = 'WORLD',
}

const enums = {
  Foo,
  Starter,
};

describe('[enum-util.test.ts] suite', () => {
  test('[buildEnums] should transform enum into key:values object', () => {
    expect(buildEnums(enums)).toStrictEqual({
      Foo: { values: ['BAR', 'BAZ'] },
      Starter: { values: ['HELLO', 'WORLD'] },
    });
  });

  test('[enumToArray] should transform an enum into an array of values', () => {
    expect(enumToArray(Foo)).toStrictEqual(['BAR', 'BAZ']);
  });
});
