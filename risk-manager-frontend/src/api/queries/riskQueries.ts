import { gql } from '@apollo/client';

export const GET_RISKS = gql`
	query GetRisks($createdBy: String, $first: Int, $after: String) {
		risks(createdBy: $createdBy, first: $first, after: $after) {
			edges {
				node {
					id
					name
					description
					category {
						id
						name
					}
					resolved
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

export const DELETE_RISK = gql`
	mutation DeleteRisk($id: ID!) {
		deleteRisk(id: $id)
	}
`;

export const CREATE_RISK = gql`
	mutation CreateRisk($name: String!, $description: String, $categoryId: ID!, $createdBy: String!, $resolved: Boolean) {
		createRisk(name: $name, description: $description, categoryId: $categoryId, createdBy: $createdBy, resolved: $resolved) {
			id
			name
			description
			categoryId
			resolved
			createdBy
		}
	}
`;

export const UPDATE_RISK = gql`
	mutation UpdateRisk($id: ID!, $resolved: Boolean) {
		updateRisk(id: $id, resolved: $resolved) {
			id
			name
			description
			category {
				id
				name
			}
			resolved
			createdBy
			createdAt
			updatedAt
		}
	}
`;
