export const typedefsString = `
input  AuthorWhereInput {
	id: Int
	name: String
	surname: String
	AND: [AuthorWhereInput]
	OR: [AuthorWhereInput]
	FILTERS: AuthorWhereFilterInput
}

input AuthorWhereFilterOperatorMapInput {
	LIKE: String!
	NOT_LIKE: String!
	STARTS_WITH: String!
	ENDS_WITH: String!
	SUBSTRING: String!
	EQ_STRING: String!
	NE_STRING: String!
	EQ_INT: Int!
	NE_INT: Int!
	IS_NULL: String!
	NOT_STRING: String!
	NOT_INT: Int!
	GT: Int!
	GTE: Int!
	LT: Int!
	LTE: Int!
	BETWEEN_INT: Int!
	BETWEEN_DATE: DateTime!
	NOT_BETWEEN_INT: Int!
	NOT_BETWEEN_DATE: DateTime!
	IN_INT: Int!
	IN_STRING: String!
	NOT_IN_INT: Int!
	NOT_IN_STRING: String!
}

input AuthorWhereFilterInput {
	id: AuthorWhereFilterOperatorMapInput, name: AuthorWhereFilterOperatorMapInput, surname: AuthorWhereFilterOperatorMapInput
}
extend type Mutation {
	createAuthor(input: AuthorInput!): Author! 
	createManyAuthors(input: [AuthorInput!]!): [Author!]! 
	updateAuthor(where: AuthorWhereInput, input: UpdateAuthorInput!): Author! 
	deleteAuthor(where: AuthorWhereInput, options: DeleteOptions): DeleteResponse 
	upsertAuthor(where: AuthorWhereInput, input: AuthorInput!): Author! 

}

extend type Query {
	author(where: AuthorWhereInput, options: OptionsInput): Author 
	authorsPaged(where: AuthorWhereInput, options: OptionsInputPaged): AuthorPaged! 
	allAuthors: [Author]! 

}

type  Author {
	id: Int
	name: String!
	surname: String
	birthDate: DateTime
	createdAt: DateTime!
	updatedAt: DateTime!
	removedAt: DateTime
	books(where: AuthorWhereInput): [Book]
}
input  AuthorInput {
	id: Int
	name: String
	surname: String
	birthDate: DateTime
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	books: [BookInput]
}
input  UpdateAuthorInput {
	id: Int
	name: String
	surname: String
	birthDate: DateTime
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
type AuthorPaged {
	entities: [Author]
	totalCount: Int
}

input  BookLibraryWhereInput {
	id: Int
	libraryId: Int
	bookId: Int
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	AND: [BookLibraryWhereInput]
	OR: [BookLibraryWhereInput]
	FILTERS: BookLibraryWhereFilterInput
}

input BookLibraryWhereFilterOperatorMapInput {
	LIKE: String!
	NOT_LIKE: String!
	STARTS_WITH: String!
	ENDS_WITH: String!
	SUBSTRING: String!
	EQ_STRING: String!
	NE_STRING: String!
	EQ_INT: Int!
	NE_INT: Int!
	IS_NULL: String!
	NOT_STRING: String!
	NOT_INT: Int!
	GT: Int!
	GTE: Int!
	LT: Int!
	LTE: Int!
	BETWEEN_INT: Int!
	BETWEEN_DATE: DateTime!
	NOT_BETWEEN_INT: Int!
	NOT_BETWEEN_DATE: DateTime!
	IN_INT: Int!
	IN_STRING: String!
	NOT_IN_INT: Int!
	NOT_IN_STRING: String!
}

input BookLibraryWhereFilterInput {
	id: BookLibraryWhereFilterOperatorMapInput, libraryId: BookLibraryWhereFilterOperatorMapInput, bookId: BookLibraryWhereFilterOperatorMapInput, createdAt: BookLibraryWhereFilterOperatorMapInput, updatedAt: BookLibraryWhereFilterOperatorMapInput, removedAt: BookLibraryWhereFilterOperatorMapInput
}
extend type Mutation {
	createBookLibrary(input: BookLibraryInput!): BookLibrary! 
	createManyBookLibraries(input: [BookLibraryInput!]!): [BookLibrary!]! 
	updateBookLibrary(where: BookLibraryWhereInput, input: UpdateBookLibraryInput!): BookLibrary! 
	deleteBookLibrary(where: BookLibraryWhereInput, options: DeleteOptions): DeleteResponse 
	upsertBookLibrary(where: BookLibraryWhereInput, input: BookLibraryInput!): BookLibrary! 

}

extend type Query {
	bookLibrary(where: BookLibraryWhereInput, options: OptionsInput): BookLibrary 
	bookLibraries(where: BookLibraryWhereInput, options: OptionsInput): [BookLibrary]! 
	bookLibrariesPaged(where: BookLibraryWhereInput, options: OptionsInputPaged): BookLibraryPaged! 
	allBookLibraries: [BookLibrary]! 

}

type  BookLibrary {
	id: Int
	libraryId: Int
	bookId: Int
	createdAt: DateTime!
	updatedAt: DateTime!
	removedAt: DateTime
}
input  BookLibraryInput {
	id: Int
	libraryId: Int
	bookId: Int
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
input  UpdateBookLibraryInput {
	id: Int
	libraryId: Int
	bookId: Int
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
type BookLibraryPaged {
	entities: [BookLibrary]
	totalCount: Int
}

input  BookWhereInput {
	id: Int
	isbn: String
	title: String
	categoryId: Int
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	AND: [BookWhereInput]
	OR: [BookWhereInput]
	FILTERS: BookWhereFilterInput
}

input BookWhereFilterOperatorMapInput {
	LIKE: String!
	NOT_LIKE: String!
	STARTS_WITH: String!
	ENDS_WITH: String!
	SUBSTRING: String!
	EQ_STRING: String!
	NE_STRING: String!
	EQ_INT: Int!
	NE_INT: Int!
	IS_NULL: String!
	NOT_STRING: String!
	NOT_INT: Int!
	GT: Int!
	GTE: Int!
	LT: Int!
	LTE: Int!
	BETWEEN_INT: Int!
	BETWEEN_DATE: DateTime!
	NOT_BETWEEN_INT: Int!
	NOT_BETWEEN_DATE: DateTime!
	IN_INT: Int!
	IN_STRING: String!
	NOT_IN_INT: Int!
	NOT_IN_STRING: String!
}

input BookWhereFilterInput {
	id: BookWhereFilterOperatorMapInput, isbn: BookWhereFilterOperatorMapInput, title: BookWhereFilterOperatorMapInput, categoryId: BookWhereFilterOperatorMapInput, createdAt: BookWhereFilterOperatorMapInput, updatedAt: BookWhereFilterOperatorMapInput, removedAt: BookWhereFilterOperatorMapInput
}
extend type Mutation {
	createBook(input: BookInput!): Book! 
	createManyBooks(input: [BookInput!]!): [Book!]! 
	updateBook(where: BookWhereInput, input: UpdateBookInput!): Book! 
	deleteBook(where: BookWhereInput, options: DeleteOptions): DeleteResponse 
	upsertBook(where: BookWhereInput, input: BookInput!): Book! 

}

extend type Query {
	books(where: BookWhereInput, options: OptionsInput): [Book]! 
	booksPaged(where: BookWhereInput, options: OptionsInputPaged): BookPaged! 
	allBooks: [Book]! 

}

type  Book {
	id: Int
	isbn: String
	title: String!
	categoryId: Int
	createdAt: DateTime!
	updatedAt: DateTime!
	removedAt: DateTime
	category(where: BookWhereInput): Category
	authors(where: BookWhereInput): [Author]
	libraries(where: BookWhereInput): [Library]
}
input  BookInput {
	id: Int
	isbn: String
	title: String
	categoryId: Int
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	category: CategoryInput
	authors: [AuthorInput]
	libraries: [LibraryInput]
}
input  UpdateBookInput {
	id: Int
	isbn: String
	title: String
	categoryId: Int
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
type BookPaged {
	entities: [Book]
	totalCount: Int
}

input  CategoryWhereInput {
	id: Int
	name: String
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	AND: [CategoryWhereInput]
	OR: [CategoryWhereInput]
	FILTERS: CategoryWhereFilterInput
}

input CategoryWhereFilterOperatorMapInput {
	LIKE: String!
	NOT_LIKE: String!
	STARTS_WITH: String!
	ENDS_WITH: String!
	SUBSTRING: String!
	EQ_STRING: String!
	NE_STRING: String!
	EQ_INT: Int!
	NE_INT: Int!
	IS_NULL: String!
	NOT_STRING: String!
	NOT_INT: Int!
	GT: Int!
	GTE: Int!
	LT: Int!
	LTE: Int!
	BETWEEN_INT: Int!
	BETWEEN_DATE: DateTime!
	NOT_BETWEEN_INT: Int!
	NOT_BETWEEN_DATE: DateTime!
	IN_INT: Int!
	IN_STRING: String!
	NOT_IN_INT: Int!
	NOT_IN_STRING: String!
}

input CategoryWhereFilterInput {
	id: CategoryWhereFilterOperatorMapInput, name: CategoryWhereFilterOperatorMapInput, createdAt: CategoryWhereFilterOperatorMapInput, updatedAt: CategoryWhereFilterOperatorMapInput, removedAt: CategoryWhereFilterOperatorMapInput
}
extend type Mutation {
	createCategory(input: CategoryInput!): Category! 
	createManyCategories(input: [CategoryInput!]!): [Category!]! 
	updateCategory(where: CategoryWhereInput, input: UpdateCategoryInput!): Category! 
	deleteCategory(where: CategoryWhereInput, options: DeleteOptions): DeleteResponse 
	upsertCategory(where: CategoryWhereInput, input: CategoryInput!): Category! 

}

extend type Query {
	category(where: CategoryWhereInput, options: OptionsInput): Category 
	categories(where: CategoryWhereInput, options: OptionsInput): [Category]! 
	categoriesPaged(where: CategoryWhereInput, options: OptionsInputPaged): CategoryPaged! 
	allCategories: [Category]! 

}

type  Category {
	id: Int
	name: String!
	createdAt: DateTime!
	updatedAt: DateTime!
	removedAt: DateTime
}
input  CategoryInput {
	id: Int
	name: String
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
input  UpdateCategoryInput {
	id: Int
	name: String
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
type CategoryPaged {
	entities: [Category]
	totalCount: Int
}

input  CityWhereInput {
	id: Int
	postalCode: String
	name: String
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	AND: [CityWhereInput]
	OR: [CityWhereInput]
	FILTERS: CityWhereFilterInput
}

input CityWhereFilterOperatorMapInput {
	LIKE: String!
	NOT_LIKE: String!
	STARTS_WITH: String!
	ENDS_WITH: String!
	SUBSTRING: String!
	EQ_STRING: String!
	NE_STRING: String!
	EQ_INT: Int!
	NE_INT: Int!
	IS_NULL: String!
	NOT_STRING: String!
	NOT_INT: Int!
	GT: Int!
	GTE: Int!
	LT: Int!
	LTE: Int!
	BETWEEN_INT: Int!
	BETWEEN_DATE: DateTime!
	NOT_BETWEEN_INT: Int!
	NOT_BETWEEN_DATE: DateTime!
	IN_INT: Int!
	IN_STRING: String!
	NOT_IN_INT: Int!
	NOT_IN_STRING: String!
}

input CityWhereFilterInput {
	id: CityWhereFilterOperatorMapInput, postalCode: CityWhereFilterOperatorMapInput, name: CityWhereFilterOperatorMapInput, createdAt: CityWhereFilterOperatorMapInput, updatedAt: CityWhereFilterOperatorMapInput, removedAt: CityWhereFilterOperatorMapInput
}
extend type Mutation {
	createCity(input: CityInput!): City! 
	createManyCities(input: [CityInput!]!): [City!]! 
	updateCity(where: CityWhereInput, input: UpdateCityInput!): City! 
	deleteCity(where: CityWhereInput, options: DeleteOptions): DeleteResponse 
	upsertCity(where: CityWhereInput, input: CityInput!): City! 

}

extend type Query {
	cities(where: CityWhereInput, options: OptionsInput): [City]! 
	citiesPaged(where: CityWhereInput, options: OptionsInputPaged): CityPaged! 
	allCities: [City]! 

}

type  City {
	id: Int
	postalCode: String!
	name: String!
	createdAt: DateTime!
	updatedAt: DateTime!
	removedAt: DateTime
}
input  CityInput {
	id: Int
	postalCode: String
	name: String
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
input  UpdateCityInput {
	id: Int
	postalCode: String
	name: String
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
type CityPaged {
	entities: [City]
	totalCount: Int
}

input  LibraryWhereInput {
	id: Int
	cityId: Int
	name: String
	address: String
	description: String
	status: LibraryStatus
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	AND: [LibraryWhereInput]
	OR: [LibraryWhereInput]
	FILTERS: LibraryWhereFilterInput
}

input LibraryWhereFilterOperatorMapInput {
	LIKE: String!
	NOT_LIKE: String!
	STARTS_WITH: String!
	ENDS_WITH: String!
	SUBSTRING: String!
	EQ_STRING: String!
	NE_STRING: String!
	EQ_INT: Int!
	NE_INT: Int!
	IS_NULL: String!
	NOT_STRING: String!
	NOT_INT: Int!
	GT: Int!
	GTE: Int!
	LT: Int!
	LTE: Int!
	BETWEEN_INT: Int!
	BETWEEN_DATE: DateTime!
	NOT_BETWEEN_INT: Int!
	NOT_BETWEEN_DATE: DateTime!
	IN_INT: Int!
	IN_STRING: String!
	NOT_IN_INT: Int!
	NOT_IN_STRING: String!
}

input LibraryWhereFilterInput {
	id: LibraryWhereFilterOperatorMapInput, cityId: LibraryWhereFilterOperatorMapInput, name: LibraryWhereFilterOperatorMapInput, address: LibraryWhereFilterOperatorMapInput, description: LibraryWhereFilterOperatorMapInput, status: LibraryWhereFilterOperatorMapInput, createdAt: LibraryWhereFilterOperatorMapInput, updatedAt: LibraryWhereFilterOperatorMapInput, removedAt: LibraryWhereFilterOperatorMapInput
}
extend type Mutation {
	createLibrary(input: LibraryInput!): Library! 
	createManyLibraries(input: [LibraryInput!]!): [Library!]! 
	updateLibrary(where: LibraryWhereInput, input: UpdateLibraryInput!): Library! 
	deleteLibrary(where: LibraryWhereInput, options: DeleteOptions): DeleteResponse 
	upsertLibrary(where: LibraryWhereInput, input: LibraryInput!): Library! 

}

extend type Query {
	library(where: LibraryWhereInput, options: OptionsInput): Library 
	libraries(where: LibraryWhereInput, options: OptionsInput): [Library]! 
	librariesPaged(where: LibraryWhereInput, options: OptionsInputPaged): LibraryPaged! 
	allLibraries: [Library]! 

}

type  Library {
	id: Int
	cityId: Int
	name: String!
	address: String
	description: String
	status: LibraryStatus!
	createdAt: DateTime!
	updatedAt: DateTime!
	removedAt: DateTime
	city(where: LibraryWhereInput): City
	books(where: LibraryWhereInput): [Book]
}
input  LibraryInput {
	id: Int
	cityId: Int
	name: String
	address: String
	description: String
	status: LibraryStatus
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
	city: CityInput
	books: [BookInput]
}
input  UpdateLibraryInput {
	id: Int
	cityId: Int
	name: String
	address: String
	description: String
	status: LibraryStatus
	createdAt: DateTime
	updatedAt: DateTime
	removedAt: DateTime
}
type LibraryPaged {
	entities: [Library]
	totalCount: Int
}

enum LibraryStatus {
	ACTIVE
	INACTIVE
}
enum OrderDirection {
	ASC
	DESC
}

input OrderInput {
	field: String
	dir: OrderDirection
}

input OptionsInput {
	order: [OrderInput]
	group: String

}

input OptionsInputPaged {
	order: [OrderInput]
	group: String

	offset: Int
	limit: Int
}

type DeleteResponse {
	id: JSON, 
	deletedCount: Int
}

scalar DateTime
scalar Date

type Query {
	_dummyQuery: Int
}

type Mutation {
	_dummyMutation: Int
}

scalar JSON

input DeleteOptions {
	force: Boolean
}`;