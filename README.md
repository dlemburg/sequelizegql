### TODO

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

### readme notes

- all `pathTo<entity>` must be absolute from root directory
- note that for `pathToCustomSchema`, if filepath is glob, exports must be located on `resolvers` or `typedefs` property
- export paths can be named after entity or located on default; i.e. `pathToSequelize.sequelize | pathToSequelize.default`, `pathToSchemaMap.schemaMap | pathToSchemaMap.default`
- note that 'create mutations' only allow one level of associations; 'update mutations' do not allow for multiple levels yet

## Options

---

All filepaths are file/directory paths from root working folder; values can be globs, i.e. `/path/to/dir/**/*`

&nbsp;

### Object `options`

| name                   | type                     | example |
| ---------------------- | ------------------------ | ------- |
| `sequelize`            | `Sequelize`              |
| `models`               | `Record<string, Model>`  |
| `pathToEnums`          | `Record<string, string>` |
| `customSchema`         | `CustomSchema`           |
| `schemaMap`            | `SchemaMap`              |
| `deleteResponseGql`    | `string`                 | -       |
| `includeDeleteOptions` | `boolean`                | -       |

&nbsp;

Export Note

- for Filepath options export naming rules, you can export `default`, use a matcher function, or use the provided object property name listed below.
- we will always use `default` if no other properties are present
- we will always use the provided export property name if present
- matchers will always be called regardless of above (use this if you have files with multiple exports that you want ignored)

### Filepath `options`

| name                 | type   | export rules                                             |
| -------------------- | ------ | -------------------------------------------------------- |
| `pathToCustomSchema` | string | `default`, `customSchema` or `customSchemaExportMatcher` |
| `pathToModels`       | string | `default`, `models` or `modelsExportMatcher`             |
| `pathToEnums`        | string | `default`, `enums` or `enumsExportMatcher`               |
| `pathToSequelize`    | string | `default`, `sequelize` or `sequelizeExportMatcher`       |
| `pathToSchemaMap`    | string | `default`, `schemaMap` or `schemaMapExportMatcher`       |

### Matchers `options`

| name                        | type | export rules                                         |
| --------------------------- | ---- | ---------------------------------------------------- |
| `customSchemaExportMatcher` | fn   | return object after omit/pick properties off exports |
| `modelsExportMatcher`       | fn   | return object after omit/pick properties off exports |
| `enumsExportMatcher`        | fn   | return object after omit/pick properties off exports |
| `sequelizeExportMatcher`    | fn   | return object after omit/pick properties off exports |
| `schemaMapExportMatcher`    | fn   | return object after omit/pick properties off exports |

&nbsp;

### Mandatory `options`

- each set of properties is an _xor_ - one of each set of properties must be provided

| object         | filepath             |
| -------------- | -------------------- |
| `customSchema` | `pathToCustomSchema` |
| `models`       | `pathToModels`       |
| `enums`        | `pathToEnums`        |
| `sequelize`    | `pathToSequelize`    |
| `schemaMap`    | `pathToSchemaMap`    |
