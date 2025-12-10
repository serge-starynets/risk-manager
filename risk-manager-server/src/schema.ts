const gql = String.raw;

export const typeDefs = gql`
	type Risk {
		id: ID!
		name: String!
		description: String
		categoryId: ID!
		category: Category
		resolved: Boolean!
		createdBy: String!
		createdAt: String
		updatedAt: String
	}

	type Category {
		id: ID!
		name: String!
		description: String
		createdBy: String!
		createdAt: String
		updatedAt: String
	}

	type PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
		totalCount: Int
	}

	type RisksConnection {
		edges: [RiskEdge!]!
		pageInfo: PageInfo!
	}

	type RiskEdge {
		node: Risk!
		cursor: String!
	}

	type CategoriesConnection {
		edges: [CategoryEdge!]!
		pageInfo: PageInfo!
	}

	type CategoryEdge {
		node: Category!
		cursor: String!
	}

	type Query {
		risks(createdBy: String, first: Int, after: String): RisksConnection!
		risk(id: ID!): Risk
		categories(createdBy: String, first: Int, after: String): CategoriesConnection!
		allCategories: [Category!]!
		category(id: ID!): Category
	}

	type Mutation {
		createRisk(name: String!, description: String, categoryId: ID!, createdBy: String!, resolved: Boolean): Risk!
		deleteRisk(id: ID!): Boolean!
		updateRisk(id: ID!, name: String, description: String, categoryId: ID, resolved: Boolean): Risk!
		createCategory(name: String!, description: String, createdBy: String!): Category!
		deleteCategory(id: ID!): Boolean!
		updateCategory(id: ID!, name: String, description: String): Category!
	}
`;
