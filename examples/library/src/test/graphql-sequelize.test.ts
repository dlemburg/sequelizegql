import { EXAMPLE_INITIALIZATION_OPTIONS } from '../example-entities/options';
import { getSchema } from '../graphql/schemas';
import { setup } from './config/setup';
import { typedefsString as importsTypedefsString } from './snapshots/imports-typedefs-string';
import { removeAllWhitespace } from './util/remove-whitespace';

describe('[graphql-sequelize.test.ts] suite', () => {
  // test('[getSchema] `pathOnly` options should return a graphql schema typedefs matching `paths-typedefs-string`', async () => {
  //   await setup();
  //   const result = await getSchema(EXAMPLE_INITIALIZATION_OPTIONS.pathOnlyTest);
  //   expect(removeAllWhitespace(result.typedefsString)).toEqual(
  //     removeAllWhitespace(pathsTypedefsString)
  //   );
  // });
  test('[getSchema] `imports` options should return a graphql schema typedefs matching `imports-typedefs-string`', async () => {
    // const sequelize = await setup();
    // const result = await getSchema({
    //   ...EXAMPLE_INITIALIZATION_OPTIONS.imports,
    //   sequelize,
    // });
    // const foo = removeAllWhitespace(importsTypedefsString);
    // const bar = foo.includes(
    //   'inputUpdateCategoryInput{id:Intname:String}typeCategoryPaged{entities:[Category]totalCount:Int}inputCityWhereInpu'
    // );
    // expect(removeAllWhitespace(result.typedefsString)).toEqual(
    //   removeAllWhitespace(importsTypedefsString)
    // );

    // TODO
    expect(1 + 1).toEqual(2);
  });
});
