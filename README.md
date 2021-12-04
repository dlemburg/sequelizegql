### TODO

1.) Example schema and tests

## Potential Examples

### 1

https://www.omdbapi.com/

### 2

- Library
- Book
- Author
- BookAuthor
- User
- UserBook

  - operators: undo JSON! type for multivariant type
  - merge utility: 'customSchemaPath', 'customTypes' [IN_PROGRESS]
  - README (lightweight docs)
  - Clean up all types [IN_PROGRESS]

  - Extend the Sequelize DataTypes, make db-client-specific data type mappings (requires a 'client' input) [DONE_KINDA]
  - Pluralization (optional) [DONE]
  - Build out the default sequelize options, - - paging - order [DONE]
  - Print/Export Schema [DONE]
  - 'omitResolvers' option [DONE]
  - onBeforeResolve, onAfterResolve middlewares [DONE]
  - createMany resolver/typedef [DONE]
  - add AND, OR operator filters to whereInput [DONE]
  - add sequelize-mapped operator FILTERS to whereInput [DONE]
  - operators: gql [DONE]
  - parse operator FILTERS on associated query fields [DONE]
  - add paging endpoint [DONE]

future support (v2)

- cli
- crawl database and generate models, types, etc
- operators: recursive
- Recursive creates - currently 1 level deep
