### TODO

### v1

- Integrations tests against database
- README (lightweight docs)
- Test coverage

### v2

- cli
- crawl database and generate models, types, etc
- operators: recursive
- Recursive creates - currently 1 level deep

### readme notes

- all `pathTo<entity>` must be absolute from root directory
- note that for `pathToCustomSchema`, if filepath is glob, exports must be located on `resolvers` or `typedefs` property
- export paths can be named after entity or located on default; i.e. `pathToSequelize.sequelize | pathToSequelize.default`, `pathToSchemaMap.schemaMap | pathToSchemaMap.default`
- note that 'create mutations' only allow one level of associations; 'update mutations' do not allow for multiple levels yet
