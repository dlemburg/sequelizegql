# sequelize-graphql

- [Installation](https://github.com/dlemburg/sequelize-graphql#installation)
- [What is `sequelize-graphql`?](https://github.com/dlemburg/sequelize-graphql#what)
- [Why use `sequelize-graphql`?](https://github.com/dlemburg/sequelize-graphql#why)
- [Advantages](https://github.com/dlemburg/sequelize-graphql#advantages)
- [Examples](https://github.com/dlemburg/sequelize-graphql#examples)
  - [Basic Example](https://github.com/dlemburg/sequelize-graphql#basic)
  - [In-Depth Example](https://github.com/dlemburg/sequelize-graphql#in-depth)
  - [Query Magic Example](https://github.com/dlemburg/sequelize-graphql#query-magic-example)
- [API](https://github.com/dlemburg/sequelize-graphql#api)
  - [Object Options](https://github.com/dlemburg/sequelize-graphql#options)
  - [Filepath Options](https://github.com/dlemburg/sequelize-graphql#filepath-options)
  - [Export Matcher Options](https://github.com/dlemburg/sequelize-graphql#export-matcher-options)
  - [Required Options](https://github.com/dlemburg/sequelize-graphql#required-options)
- [TODO](https://github.com/dlemburg/sequelize-graphql#todo)

## Installation

```terminal
npm install sequelize sequelize-graphql
```

## What?

`sequelize-graphql` generates a full CRUD GraphQL API (types, inputs, enums, queries, mutations, and resolvers) based on the provided sequelize models.

## Why?

The inspiration for this library was simple: fantastic tools exist in the data-layer/graphql generation space for database first [here](https://supabase.com/blog/2021/12/03/pg-graphql), postgres first [here](https://www.npmjs.com/package/postgraphile), and prisma first [here](https://typegraphql.com/), but missing for sequelize users or those who lean towards code-first data-layer design.

Sequelize ORM has been around nearly a decade. Greenfield projects utilizing graphql/sequelize are spun up daily and legacy REST/sequelize projects may want to bring GraphQL into their ecosystem.

Popular generation tools hit a ceiling very quickly when systems mature and business logic becomes more complex. The allowable configuration options (on root level and model level) are an attempt to remove that barrier and scale well long-term.

## Advantages

- Generated schema is similar API to sequelize itself, including APIs for query filters (sequelize operators)
- Not limited to one database client
- Performant (no benchmarks yet): generated resolvers do not over-fetch - the resolver layer introspects the query fields and dynamically generates one sequelize query w/ only the requested _includes_ and _attributes_ (note that the _1:many_ and _many:many_ queries get separated under the hood to boost performance [see sequelize docs here and search for 'separate: true'](https://sequelize.org/master/manual/eager-loading.html))
- Decide which endpoints you want generated via `omitResolvers, generate` options
- Supply pre-built directives to individual endpoints via `directive` option
- Limit which fields can be supplied in `input` in create/update mutations via `omitInputAttributes`
- Middleware to execute business logic via `onBeforeResolve, onAfterResolve` - would recommend using `graphql-middleware` if complex business logic is needed (cleaner code, imo)
- Works well with your own endpoints: provide your own custom schema to merge under the hood, or take the output and merge into your own custom schema
- Options discoverability via file reading in case you have old, hard-to-refactor code (refactor anyway!) - we can work around this.
- Works well with federated schemas

# Examples

Examples use `sequelize-typescript` but work fine with `sequelize` too (issues/PRs welcome!)

## Basic

```typescript
const graphqlSequelize = new SequelizeGraphql();
const schema = await graphqlSequelize.schema(options);

console.log(schema); // { resolvers, typedefs, typedefsString }

// ... load returned schema into your graphql client
```

## In-Depth

```typescript
@Table({ underscored: true, tableName: 'author', paranoid: true })
export class Author extends Model<Author> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: String;

  @Column
  surname: String;

  // ...timestamps: createdAt, updatedAt, removedAt, etc

  // ...associations
}

@Table({ underscored: true, tableName: 'book', paranoid: true })
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  isbn: String;

  @AllowNull(false)
  @Column
  title: String;

  // ...timestamps: createdAt, updatedAt, removedAt, etc

  // ...associations
}

@Table({ underscored: true, tableName: 'book_author', paranoid: true })
export class BookAuthor extends Model<BookAuthor> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => Author)
  authorId: number;

  @Column
  @ForeignKey(() => Book)
  bookId: number;

  // ...timestamps: createdAt, updatedAt, removedAt, etc

  // ...associations
}

@Table({ underscored: true, tableName: 'city', paranoid: true })
export class City extends Model<City> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: String;

  // ...timestamps: createdAt, updatedAt, removedAt, etc

  // ...associations
}


// rootSchemaMap applies to *every* model's generated endpoints
// all configurable options listed below
const rootSchemaMap = {
  generate: true,                                  // obviously
  directive: `@acl(role: ['ADMIN', 'USER'])`;      // added to every endpoint
  whereInputAttributes?: ['id'];                   // queries will only be able to filter on 'id'
  omitResolvers: [GeneratedResolverField.DESTROY]; // don't generate any delete endpoints
  omitInputAttributes?: ['id', 'createdAt', 'updatedAt', 'removedAt'];
  onBeforeResolve?: (args) => { /* ...do some business logic */};
  onAfterResolve?: (args) => { /* ...notify some integration */};
  fieldNameMappers?: {
    FILTERS: 'MY_CUSTOM_FILTERS_NAME';             // defaults to 'FILTERS'
  };
}

// schemaMap gets applied to the specified model's generated endpoints - allows for different configurations based on model
// *** IMPORTANT *** this config takes precedence over the root schema; under the hood, psuedo looks like `merge(rootSchemaMap, schemaMap)`
const schemaMap = {
  // note: case-sensitivity is not strict
  author: {
    whereInputAttributes: ['id', 'name', 'surname'], // i.e. these fields fulfill our fuzzy search requirements
    resolvers: {
      upsert: { generate: false }, // i.e. we don't ever upsert authors
    },
  },
  Book: {
    resolvers: {
      destroy: { generate: true }, // i.e. let's override the `rootSchemaMap`
    },
    omitResolvers: [GeneratedResolverField.FIND_ALL], // i.e. this will take down our servers, so we don't want it :)
  },
  BookAuthor: {
    generate: false, // i.e. it's a join table, we don't need it
  },
  City: {
    omitResolvers: [GeneratedResolverField.FIND_ONE], // i.e. we never query for just one city
  },
};

enum LibraryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

const options = {
  rootSchemaMap,
  schemaMap,
  enums: { LibraryStatus },
  models: { Author, Book, AuthorBook, City },
};

const graphqlSequelize = new SequelizeGraphql();
const schema = await graphqlSequelize.schema(options);

console.log(schema); // { resolvers, typedefs, typedefsString }

// ... load returned schema into your graphql client
```

## Query Magic Example

For the above example, the following `Author` Queries and Mutations are available (_and similar for every other model_);

### Queries

| Name           | Args                                                  | Return Type                                                         |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| `author`       | `where: AuthorWhereInput, options: OptionsInput`      | `Author`                                                            |
| `authors`      | `where: AuthorWhereInput, options: OptionsInput`      | `[Author]`                                                          |
| `authorsPaged` | `where: AuthorWhereInput, options: OptionsInputPaged` | `AuthorPagedResponse` i.e.`{ totalCount: Int, entities: [Author] }` |
| `allAuthors`   | none                                                  | `[Author]`                                                          |

### Mutations

| Name                | Args                                                 | Return Type                 |
| ------------------- | ---------------------------------------------------- | --------------------------- |
| `createAuthor`      | `input: AuthorInput!`                                | `Author!`                   |
| `createManyAuthors` | `input: [AuthorInput!]!`                             | `[Author!]!`                |
| `updateAuthor`      | `where: AuthorWhereInput, input: UpdateAuthorInput!` | `Author`                    |
| `upsertAuthor`      | `where: AuthorWhereInput, input: AuthorInput!`       | `Author`                    |
| `deleteAuthor`      | `where: AuthorWhereInput, options: DeleteOptions`    | `DeleteResponse` by default |

&nbsp;
A query (pseudocode) like this:

```graphql
Query GetAuthors($authorsWhereInput: AuthorWhereInput!, $booksWhereInput: BookWhereInput!) {
  authors(where: $authorsWhereInput) {
    id
    name
    books(where: $booksWhereInput) {
      id
      libraries {
        id
        city {
          name
        }
      }
    }
  }
}
```

&nbsp;
will generate and execute a sequelize query like this:

```typescript
Author.findAll({
  where: authorsWhereInput,
  attributes: ['id', 'name', 'books'],
  include: [
    {
      association: 'books',
      attributes: ['id', 'libraries'],
      where: booksWhereInput,
      separate: true,
      include: [
        {
          association: 'libraries',
          attributes: ['id', 'city'],
          separate: true,
          include: [
            {
              association: 'city',
              attributes: ['name'],
            },
          ],
        },
      ],
    },
  ],
});
```

&nbsp;
See full application schema example [here](https://github.com/dlemburg/sequelize-graphql/blob/main/examples/library/src/index.ts)

&nbsp;

# API

Note: required options [here](https://github.com/dlemburg/sequelize-graphql#required-options)

## Options

| Name                   | Type                     | Description                                                                                                                |
| ---------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `sequelize`            | `Sequelize`              | Your Sequelize instance                                                                                                    |
| `models`               | `Record<string, Model>`  | i.e. `{ Author, Book, Library, City }`                                                                                     |
| `enums`                | `Record<string, string>` | i.e. `{ LibraryStatus }`                                                                                                   |
| `customSchema`         | `CustomSchema`           | i.e. `{ resolvers, typedefs }` - if provided, we will generate and merge the provided custom schema                        |
| `schemaMap`            | `SchemaMap`              | Complex object that allows configuration and overrides for every model                                                     |
| `rootSchemaMap`        | `SchemaMapOptions`       | Same as above, but will be applied to _all_ models: use this or add to above `schemaMap[SEQUELIZE_GRAPHQL_NAMESPACE.root]` |
| `deleteResponseGql`    | `string`                 | Your own slimmed-down delete response; by default - `DeleteResponse`                                                       |
| `includeDeleteOptions` | `boolean`                | This will create delete mutations that accept `options: DeleteOptions` as args                                             |

&nbsp;

### Filepath `options`

| Name                 | Type   | Export Naming Rules                   |
| -------------------- | ------ | ------------------------------------- |
| `pathToCustomSchema` | string | `default`, `customSchema`, everything |
| `pathToModels`       | string | `default`, `models`, everything       |
| `pathToEnums`        | string | `default`, `enums`, everything        |
| `pathToSequelize`    | string | `default`, `sequelize`, everything    |
| `pathToSchemaMap`    | string | `default`, `schemaMap`, everything    |

&nbsp;

### Export Matcher `options`

| Name                        | Type          | Export Rules                                         |
| --------------------------- | ------------- | ---------------------------------------------------- |
| `customSchemaExportMatcher` | `fn(exports)` | return object after omit/pick properties off exports |
| `modelsExportMatcher`       | `fn(exports)` | ^ same                                               |
| `enumsExportMatcher`        | `fn(exports)` | ^ same                                               |
| `sequelizeExportMatcher`    | `fn(exports)` | ^ same                                               |
| `schemaMapExportMatcher`    | `fn(exports)` | ^ same                                               |

### Notes on Filepath `options`

- All filepaths from root working folder; values can be globs, i.e. `/path/to/dir/**/*`
- All `pathTo<entity>` must be absolute from root directory
- Note that for `pathToCustomSchema`, if filepath is glob, exports must be located on `resolvers` or `typedefs` property
- Export paths can be named after entity or located on default; i.e. `pathToSequelize.sequelize | pathToSequelize.default`, `pathToSchemaMap.schemaMap | pathToSchemaMap.default`
- Note that 'create mutations' only allow one level of associations; 'update mutations' do not allow for multiple levels yet

&nbsp;

### Notes on Filepath Export Matcher `options`

- For Filepath options export naming rules, you can export `default`, use a matcher function, or use the provided object property name listed below.
- We will always use the provided export property name if present
- We will always use `default` if no other properties are present
- Matchers will always be called regardless of above (use this if you have files with multiple exports that you want ignored)
- After all of the above have been respected, the entire object will be merged into the accumulated result (accumulated may mean one file's export or multiple files if a glob has been provided)

&nbsp;

### Required `options`

Each set of properties is an _xor_ (one of each set of properties must be provided - validation will fail otherwise)
&nbsp;

| object      | filepath          |
| ----------- | ----------------- |
| `models`    | `pathToModels`    |
| `enums`     | `pathToEnums`     |
| `sequelize` | `pathToSequelize` |

&nbsp;

# TODO

### alpha

- unit test coverage, Integrations tests against database
- code and docs cleanup: refactor, patterns, types

### v1

- recursive operators
- recursive creates (currently 1 level of associations deep)
- recursive updates (no associations allowed yet)

### v2

- cli
- crawl database and generate models, types, etc
