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

### Options

---

- All paths are filepath from root working folder; values can be globs, i.e. `/**/*`

## Object `options`

| name         | type                     | example |
| ------------ | ------------------------ | ------- |
| sequelize    | `Sequelize`              |
| models       | `Record<string, Model>`  |
| pathToEnums  | `Record<string, string>` |
| customSchema | object                   |
| schemaMap    | `SchemaMap`              |

## Filepath `options`

| name               | type   | file type            | export naming rules                                          |
| ------------------ | ------ | -------------------- | ------------------------------------------------------------ |
| pathToCustomSchema | string | file, directory glob | `default`, `resolvers`, `typedefs`                           |
| pathToModels       | string | file, directory glob | `default`, name of model, i.e. `export class Author { ... }` |
| pathToEnums        | string | file, directory glob | anything exported from file                                  |
| pathToSequelize    | string | file, directory glob | `default`, `sequelize`                                       |
| pathToSchemaMap    | string | file, directory glob | `default`, `schemaMap`                                       |

## Mandatory `options` (each property is an xor - one or the other needs to be registered)

| object       | filepath           |
| ------------ | ------------------ |
| customSchema | pathToCustomSchema |
| models       | pathToModels       |
| enums        | pathToEnums        |
| sequelize    | pathToSequelize    |
| schemaMap    | pathToSchemaMap    |
