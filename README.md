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

  2.) Extend the Sequelize DataTypes, make db-client-specific data type mappings (requires a 'client' input) [DONE_KINDA]
  3.) Pluralization (optional) [DONE]
  4.) Build out the default sequelize options, i.e - paging - order [DONE]
  5.) Print/Export Schema
  6.) Clean up all types [IN_PROGRESS]
  7.) 'omitResolvers' option [DONE]
  8.) merge utility: 'customSchemaPath', 'customTypes'
  9.) Recursive creates - currently 1 level deep
  10.) README (lightweight docs)
  11.) onBeforeResolve, onAfterResolve middlewares [DONE]
  12.) createMany resolver/typedef [DONE]
  13.) add AND, OR operator filters to whereInput [DONE]
  14.) add sequelize-mapped operator FILTERS to whereInput [IN_PROGRESS]
  15.) operators: gql [DONE]
  16.) operators: undo JSON! type for multivariant type

future support (v2)

- cli
- crawl database and generate models, types, etc
- operators: recursive
