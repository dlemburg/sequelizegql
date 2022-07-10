# sequelizegql

- [Quick Start](https://github.com/dlemburg/sequelizegql#basic)
- [Author Note](https://github.com/dlemburg/sequelizegql#author-note)
- [Installation](https://github.com/dlemburg/sequelizegql#installation)
- [What is `sequelizegql`?](https://github.com/dlemburg/sequelizegql#what)
- [Why use `sequelizegql`?](https://github.com/dlemburg/sequelizegql#why)
- [Advantages](https://github.com/dlemburg/sequelizegql#advantages)
- [Examples](https://github.com/dlemburg/sequelizegql#examples)
  - [Basic Example](https://github.com/dlemburg/sequelizegql#basic)
  - [In-Depth Example](https://github.com/dlemburg/sequelizegql#in-depth)
  - [Generated Example](https://github.com/dlemburg/sequelizegql#generated-example)
    - [Queries](https://github.com/dlemburg/sequelizegql#queries)
    - [Mutations](https://github.com/dlemburg/sequelizegql#mutations)
    - [Types and Inputs](https://github.com/dlemburg/sequelizegql#types-and-inputs)
    - [FILTERS](https://github.com/dlemburg/sequelizegql#filters)
- [API](https://github.com/dlemburg/sequelizegql#api)
  - [Object Options](https://github.com/dlemburg/sequelizegql#options)

## Quick Start

If you just want to see the minimum example to get up and running quickly - [go here](https://github.com/dlemburg/sequelizegql#basic)!

## Author Note

**_*This is in alpha - it is not yet stable*!_**

Just a quick personal note - you can find the technical reasons for building this project [below](https://github.com/dlemburg/sequelizegql#why). Personally, I enjoy building these sorts of abstractions and find them useful. I do plan on continued development to gain production-level stability. That said, I have family, hobbies, and plenty of things I enjoy doing away from screens, etc., so if you'd like to contribute, I'd love help! Please hit me up here or via email. Thanks!

### TODO

- better unit test coverage, Integrations tests against database

## Installation

```terminal
npm install sequelizegql
```

## What?

`sequelizegql` generates a full CRUD GraphQL API (types, inputs, enums, queries, mutations, resolvers, as well as near parity - there are some slight differences - with Sequelize Operators) based on the provided sequelize models.

## Why?

The inspiration for this library was simple: fantastic tools exist in the data-layer/GraphQL generation space for database-first [here](https://supabase.com/blog/2021/12/03/pg-graphql), postgres-first [here](https://www.npmjs.com/package/postgraphile), and prisma-first [here](https://typegraphql.com/), but missing for sequelize users or those who lean towards code-first data-layer design.

[Sequelize ORM](https://sequelize.org/) is battle-tested and mature. Greenfield graphqlQL/sequelize projects are common and legacy REST/sequelize projects may want to bring GraphQL into their ecosystem.

Popular generation tools hit a ceiling very quickly when systems mature and business logic becomes more complex. The allowable configuration options (on root and model level) are an attempt to remove that barrier and scale well long-term.

## Advantages

- Generated schema is similar API to sequelize itself, including APIs for query filters (sequelize operators)
- Database agnostic by leveraging sequelize
- Performant (no benchmarks yet): generated resolvers do not over-fetch - the resolver layer introspects the query fields and dynamically generates one sequelize query w/ only the requested _includes_ and _attributes_ (note that the _1:many_ get separated under the hood to boost performance [see sequelize docs here and search for 'separate: true'](https://sequelize.org/master/manual/eager-loading.html))
- Configure precise generated endpoints via `omitResolvers, generate` options
- Supply pre-built directives to individual endpoints via `directive` option
- Limit which fields can be supplied in `input` in create/update mutations via `omitInputAttributes`
- Execute business logic with middleware via `onBeforeResolve, onAfterResolve` - if complex business logic is needed, [graphql-middleware](https://www.npmjs.com/package/graphql-middleware) is a cleaner option, imo
- Works well with your own endpoints: take the output and merge into your own custom schema
- Works well with federated schemas

# Examples

Example here uses `sequelize-typescript` but this library works fine with `sequelize` too. You can see [examples of both here](https://github.com/dlemburg/sequelizegql/tree/main/examples/library/src/orm/models)

## Basic

```typescript
const schema = SequelizeGraphql().generateSchema({ sequelize });

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

  // ...timestamps: createdAt, updatedAt, deletedAt, etc

  // Associations
  @BelongsToMany(() => Book, () => BookAuthor)
  books?: Book[];
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

  // ...timestamps: createdAt, updatedAt, deletedAt, etc

  // Associations
  @BelongsTo(() => Category)
  category?: Category;

  @BelongsToMany(() => Author, () => BookAuthor)
  authors?: Author[];

  @BelongsToMany(() => Library, () => BookLibrary)
  libraries?: Library[];
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

  // ...timestamps: createdAt, updatedAt, deletedAt, etc

  // ...associations
}

@Table({ underscored: true, tableName: 'library', paranoid: true })
export class Library extends Model<Library> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  @ForeignKey(() => City)
  cityId: number;

  @AllowNull(false)
  @Column
  name: String;

  @Column
  address: String;

  @Column
  description: String;

  @AllowNull(false)
  @Default(LibraryStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(LibraryStatus)))
  status: LibraryStatus;

  // ...timestamps: createdAt, updatedAt, deletedAt, etc

  // Associations
  @BelongsTo(() => City)
  city?: City;

  @BelongsToMany(() => Book, () => BookLibrary)
  books?: Book[];
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

  // ...timestamps: createdAt, updatedAt, deletedAt, etc
}

// sequelize.addModels[Author, Book, AuthorBook, City];

/***
 * IMPORTANT
 *
 * `modelMap` config takes precedence over the `rootMap`;
 *  under the hood, psuedocode looks like `merge(rootMap, modelMap)`
 */

// `rootMap` applies to *every* model's generated endpoints
const rootMap = {
  directive: `@acl(role: ['ADMIN', 'USER'])`;      // added to every endpoint
  whereInputAttributes?: ['id'];                   // queries will only be able to filter on 'id'
  omitInputAttributes?: ['id', 'createdAt', 'updatedAt', 'deletedAt']; // applies to 'create', 'update' and 'upsert'
  omitResolvers: [GeneratedResolverField.DELETE_MUTATION]; // don't generate any delete endpoints
  onBeforeResolve?: (args) => { /* ...do some business logic */};
  onAfterResolve?: (args) => { /* ...notify some integration */};
  fieldNameMappers?: {
    FILTERS: 'MY_CUSTOM_FILTERS_NAME';             // defaults to 'FILTERS'
  };
}

// `modelMap` applies to *specified* model's generated endpoints
const modelMap = {
  // note: case-sensitivity is not strict
  author: {
    whereInputAttributes: ['id', 'name', 'surname'], // i.e. now 'name' and 'surname' are searchable for 'Author' model
    resolvers: {
      [GeneratedResolverField.UPSERT]: { generate: false }, // i.e. `upsertAuthor` endpoint will not be generated
    },
  },
  Book: {
    resolvers: {
      [GeneratedResolverField.DELETE]: { generate: true }, // i.e. override the `rootMap`
    },
    omitResolvers: [GeneratedResolverField.FIND_ALL], // i.e. `allBooks` endpoint not generated
  },
  BookAuthor: {
    generate: false, // i.e. all `bookAuthor` queries and mutations will not be generated
  },
  City: {
    omitResolvers: [GeneratedResolverField.FIND_ONE], // i.e. `city` query will not be generated
  },
};

const graphqlSequelize = SequelizeGraphql().generateSchema({
  rootMap,
  modelMap,
  sequelize, // your sequelize instance
});

console.log(schema); // { resolvers, typedefs, typedefsString }

// ... load returned schema into your graphql client
```

## Generated Example

For the above example, the following `Author` Queries and Mutations are available (_and similar for every other model_);

### Queries

| Name           | Args                                                  | Return Type                                                         |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| `author`       | `where: AuthorWhereInput, options: OptionsInput`      | `Author`                                                            |
| `authors`      | `where: AuthorWhereInput, options: OptionsInput`      | `[Author]`                                                          |
| `authorsPaged` | `where: AuthorWhereInput, options: OptionsInputPaged` | `AuthorPagedResponse` i.e.`{ totalCount: Int, entities: [Author] }` |
| `allAuthors`   | none                                                  | `[Author]`                                                          |

### Mutations

| Name                | Args                                                                                                      | Return Type                 |
| ------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------- |
| `createAuthor`      | `input: AuthorInput!` **_note that `create` only allows one nested level of associations at the moment_** | `Author!`                   |
| `createManyAuthors` | `input: [AuthorInput!]!`                                                                                  | `[Author!]!`                |
| `updateAuthor`      | `where: AuthorWhereInput, input: UpdateAuthorInput!`                                                      | `Author`                    |
| `upsertAuthor`      | `where: AuthorWhereInput, input: AuthorInput!`                                                            | `Author`                    |
| `deleteAuthor`      | `where: AuthorWhereInput, options: DeleteOptions`                                                         | `DeleteResponse` by default |

### Types and Inputs

- `...modelFields` represents the root fields on each model, i.e. `id`, `name`, `surname`, etc.
- `...allAssociations` model's associations, i.e. `Author->Books->Libraries->City`
- `...oneLevelOfAssociations` represents _one_ layer of associations (TODO: make recursive)
- The following are customizable via the `modelMap` where you can define fields to omit for both queries (`WhereInput`) and mutations (`Input`)
- `AND` and `OR` are available at the root level of the `WhereInput` to combine the root where input fields conditionally
- `FILTERS` is a map of where input fields where sequelize operators (mostly similar w/ exception to polymorphic operators) can be applied

&nbsp;

| Name                | Fields                                                      |
| ------------------- | ----------------------------------------------------------- |
| `AuthorWhereInput`  | `...modelFields, ...allAssociations, OR, AND, FILTERS`      |
| `AuthorInput`       | `...modelFields`, `...oneLevelOfAssociations`               |
| `UpdateAuthorInput` | `...modelFields`                                            |
| `DeleteOptions`     | `{ force: boolean }` (setting force: true will hard delete) |
| `DeleteResponse`    | `{ id: JSON, deletedCount: Int }`                           |
| `AND`               | `[AuthorWhereInput]`                                        |
| `OR`                | `[AuthorWhereInput]`                                        |
| `FILTERS`           | see below                                                   |

### FILTERS

| Name               | Fields         |
| ------------------ | -------------- |
| `NOT_LIKE`         | `String!`      |
| `STARTS_WITH`      | `String!`      |
| `ENDS_WITH`        | `String!`      |
| `SUBSTRING`        | `String!`      |
| `EQ_STRING`        | `String!`      |
| `NE_STRING`        | `String!`      |
| `EQ_INT`           | `Int!`         |
| `NE_INT`           | `Int!`         |
| `NE_INT`           | `Int!`         |
| `IS_NULL`          | `String!`      |
| `NOT_STRING`       | `String!`      |
| `NOT_INT`          | `Int!`         |
| `GT`               | `Int!`         |
| `GTE`              | `Int!`         |
| `LT`               | `Int!`         |
| `LTE`              | `Int!`         |
| `BETWEEN_INT`      | `[Int!]!`      |
| `BETWEEN_DATE`     | `[Int!]!`      |
| `NOT_BETWEEN_INT`  | `[Int!]!`      |
| `NOT_BETWEEN_DATE` | `[DateTime!]1` |
| `IN_INT`           | `[Int!]!`      |
| `IN_STRING`        | `[String!]!`   |
| `NOT_IN_INT`       | `[Int!]!`      |
| `NOT_IN_STRING`    | `[String!]!`   |

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

and payload like:

```json
{
  "authorsWhereInput": {
    "FILTERS": {
      "name": { "LIKE": "daniel" }
    }
  },
  "booksWhereInput": {
    "createdAt": "01-01-2020",
    "OR": [{ "name": "Foo" }, { "name": "Bar" }]
  }
}
```

&nbsp;
Will generate and execute a sequelize query like this:

```typescript
Author.findAll({
  where: { ...authorsWhereInput, name: { [Op.like]: '%daniel%' } },
  attributes: ['id', 'name', 'books'],
  include: [
    {
      association: 'books',
      attributes: ['id'],
      where: { ...booksWhereInput, [Op.or]: [{ name: 'Foo' }, { name: 'Bar' }] },
      separate: true,
      include: [
        {
          association: 'libraries',
          attributes: ['id'],
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
See full application schema example [here](https://github.com/dlemburg/sequelizegql/blob/main/examples/library/src/index.ts)

&nbsp;

# API

## Options

| Name                   | Type                                                                                                 | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `sequelize`            | `Sequelize`                                                                                          | Your Sequelize instance. **The only required option**                  |
| `modelMap`             | `SchemaMap` [here](https://github.com/dlemburg/sequelizegql/blob/main/src/types/types.ts#L67)        | Complex object that allows configuration and overrides for every model |
| `rootMap`              | `SchemaMapOptions` [here](https://github.com/dlemburg/sequelizegql/blob/main/src/types/types.ts#L61) | Same as above, but will be applied to _all_ models                     |
| `deleteResponseGql`    | `string`                                                                                             | Your own slimmed-down delete response; by default - `DeleteResponse`   |
| `includeDeleteOptions` | `boolean`                                                                                            | Allows for extra arg `options: DeleteOptions` on `delete<*>` endpoints |

&nbsp;
