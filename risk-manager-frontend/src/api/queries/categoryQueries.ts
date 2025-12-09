import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
	query GetCategories($createdBy: String, $first: Int, $after: String) {
		categories(createdBy: $createdBy, first: $first, after: $after) {
			edges {
				node {
					id
					name
					description
					createdBy
					createdAt
					updatedAt
				}
				cursor
			}
			pageInfo {
				hasNextPage
				hasPreviousPage
				startCursor
				endCursor
				totalCount
			}
		}
	}
`;

export const GET_ALL_CATEGORIES = gql`
	query GetAllCategories {
		allCategories {
			id
			name
			description
			createdBy
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation DeleteCategory($id: ID!) {
		deleteCategory(id: $id)
	}
`;

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($name: String!, $description: String, $createdBy: String!) {
		createCategory(name: $name, description: $description, createdBy: $createdBy) {
			id
			name
			description
			createdBy
		}
	}
`;
