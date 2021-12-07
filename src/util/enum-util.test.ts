import { buildEnums } from './enum-util';

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

test('[buildEnums] should transform enum into key:values object', () => {
  expect(buildEnums(enums)).toStrictEqual({
    Foo: { values: ['BAR', 'BAZ'] },
    Starter: { values: ['HELLO', 'WORLD'] },
  });
});
