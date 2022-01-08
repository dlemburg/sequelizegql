# sequelize-graphql

```terminal
npm install sequelize sequelize-graphql
```

## Basic Example

```typescript
const schemaMap = {
  // note: case-sensitivity is not strict
  author: {
    whereInputAttributes: ['id', 'name', 'surname'],
    resolvers: {
      findMany: { generate: false },
    },
  },
  Book: {
    resolvers: {
      findAll: { generate: true },
    },
    omitResolvers: [GeneratedResolverField.FIND_ONE],
  },
  BookAuthor: {
    generate: false,
  },
  City: {
    omitResolvers: [GeneratedResolverField.FIND_ONE],
  },
  // full property list below
  Foo: {
    // TODO
  },
};

enum LibraryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

const options = {
  schemaMap,
  enums: { LibraryStatus },
  models: Models,
};
const graphqlSequelize = new SequelizeGraphql();
const schema = await graphqlSequelize.schema(options);

console.log(schema); // { resolvers, typedefs, typedefsString }

// ... load returned schema into your graphql client
```

See more complex examples [here]

&nbsp;

# API

note required options [here]

| name                   | type                     | description                                                                                                                |
| ---------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `sequelize`            | `Sequelize`              | Your Sequelize instance                                                                                                    |
| `models`               | `Record<string, Model>`  | i.e. `{ Author, Book, Library }`                                                                                           |
| `enums`                | `Record<string, string>` | i.e. `{ LibraryStatus: { ... } }`                                                                                          |
| `customSchema`         | `CustomSchema`           | i.e. `{ resolvers, typedefs }` - if provided, we will generate and merge the provided custom schema                        |
| `schemaMap`            | `SchemaMap`              | Complex object that allows configuration and overrides for every model                                                     |
| `rootSchemaMap`        | `SchemaMapOptions`       | Same as above, but will be applied to _all_ models: use this or add to above `schemaMap[SEQUELIZE_GRAPHQL_NAMESPACE.root]` |
| `deleteResponseGql`    | `string`                 | Your own slimmed-down delete response; by default - `DeleteResponse`                                                       |
| `includeDeleteOptions` | `boolean`                | This will create delete mutations that accept `options: DeleteOptions` as args                                             |

&nbsp;

### Filepath `options`

| name                 | type   | export rules                          |
| -------------------- | ------ | ------------------------------------- |
| `pathToCustomSchema` | string | `default`, `customSchema`, everything |
| `pathToModels`       | string | `default`, `models`, everything       |
| `pathToEnums`        | string | `default`, `enums`, everything        |
| `pathToSequelize`    | string | `default`, `sequelize`, everything    |
| `pathToSchemaMap`    | string | `default`, `schemaMap`, everything    |

&nbsp;

### Matchers `options`

| name                        | type          | export rules                                         |
| --------------------------- | ------------- | ---------------------------------------------------- |
| `customSchemaExportMatcher` | `fn(exports)` | return object after omit/pick properties off exports |
| `modelsExportMatcher`       | `fn(exports)` | -                                                    |
| `enumsExportMatcher`        | `fn(exports)` | -                                                    |
| `sequelizeExportMatcher`    | `fn(exports)` | -                                                    |
| `schemaMapExportMatcher`    | `fn(exports)` | -                                                    |

### Filepath options export note

- For Filepath options export naming rules, you can export `default`, use a matcher function, or use the provided object property name listed below.
- We will always use the provided export property name if present
- We will always use `default` if no other properties are present
- Matchers will always be called regardless of above (use this if you have files with multiple exports that you want ignored)
- After all of the above have been respected, the entire object will be merged into the accumulated result (accumulated may mean one file's export or multiple files if a glob has been provided)

&nbsp;

### Filepath options note

- All filepaths from root working folder; values can be globs, i.e. `/path/to/dir/**/*`
- All `pathTo<entity>` must be absolute from root directory
- Note that for `pathToCustomSchema`, if filepath is glob, exports must be located on `resolvers` or `typedefs` property
- Export paths can be named after entity or located on default; i.e. `pathToSequelize.sequelize | pathToSequelize.default`, `pathToSchemaMap.schemaMap | pathToSchemaMap.default`
- Note that 'create mutations' only allow one level of associations; 'update mutations' do not allow for multiple levels yet

&nbsp;

### Required `options`

- each set of properties is an _xor_ - one of each set of properties must be provided

| object      | filepath          |
| ----------- | ----------------- |
| `models`    | `pathToModels`    |
| `enums`     | `pathToEnums`     |
| `sequelize` | `pathToSequelize` |

&nbsp;

# TODO

### alpha

- unit test coverage, Integrations tests against database
- README (lightweight docs)
- code cleanup: refactor, patterns, types

### v1

- recursive operators
- recursive creates (currently 1 level of associations deep)
- recursive updates (no associations allowed yet)

### v2

- cli
- crawl database and generate models, types, etc
