### TODO

### alpha

- unit test coverage, Integrations tests against database
- README (lightweight docs)


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
