// @ts-nocheck
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client/react';
import type * as ApolloTypes from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
};

export type CategoriesConnection = {
	__typename?: 'CategoriesConnection';
	edges: Array<CategoryEdge>;
	pageInfo: PageInfo;
};

export type Category = {
	__typename?: 'Category';
	createdAt?: Maybe<Scalars['String']['output']>;
	createdBy: Scalars['String']['output'];
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CategoryEdge = {
	__typename?: 'CategoryEdge';
	cursor: Scalars['String']['output'];
	node: Category;
};

export type Mutation = {
	__typename?: 'Mutation';
	createCategory: Category;
	createRisk: Risk;
	deleteCategory: Scalars['Boolean']['output'];
	deleteRisk: Scalars['Boolean']['output'];
	updateCategory: Category;
	updateRisk: Risk;
};

export type MutationCreateCategoryArgs = {
	createdBy: Scalars['String']['input'];
	description?: InputMaybe<Scalars['String']['input']>;
	name: Scalars['String']['input'];
};

export type MutationCreateRiskArgs = {
	categoryId: Scalars['ID']['input'];
	createdBy: Scalars['String']['input'];
	description?: InputMaybe<Scalars['String']['input']>;
	name: Scalars['String']['input'];
	resolved?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationDeleteCategoryArgs = {
	id: Scalars['ID']['input'];
};

export type MutationDeleteRiskArgs = {
	id: Scalars['ID']['input'];
};

export type MutationUpdateCategoryArgs = {
	description?: InputMaybe<Scalars['String']['input']>;
	id: Scalars['ID']['input'];
	name?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateRiskArgs = {
	categoryId?: InputMaybe<Scalars['ID']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
	id: Scalars['ID']['input'];
	name?: InputMaybe<Scalars['String']['input']>;
	resolved?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PageInfo = {
	__typename?: 'PageInfo';
	endCursor?: Maybe<Scalars['String']['output']>;
	hasNextPage: Scalars['Boolean']['output'];
	hasPreviousPage: Scalars['Boolean']['output'];
	startCursor?: Maybe<Scalars['String']['output']>;
	totalCount?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
	__typename?: 'Query';
	allCategories: Array<Category>;
	categories: CategoriesConnection;
	category?: Maybe<Category>;
	risk?: Maybe<Risk>;
	risks: RisksConnection;
};

export type QueryCategoriesArgs = {
	after?: InputMaybe<Scalars['String']['input']>;
	createdBy?: InputMaybe<Scalars['String']['input']>;
	first?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryCategoryArgs = {
	id: Scalars['ID']['input'];
};

export type QueryRiskArgs = {
	id: Scalars['ID']['input'];
};

export type QueryRisksArgs = {
	after?: InputMaybe<Scalars['String']['input']>;
	createdBy?: InputMaybe<Scalars['String']['input']>;
	first?: InputMaybe<Scalars['Int']['input']>;
};

export type Risk = {
	__typename?: 'Risk';
	category?: Maybe<Category>;
	categoryId: Scalars['ID']['output'];
	createdAt?: Maybe<Scalars['String']['output']>;
	createdBy: Scalars['String']['output'];
	description?: Maybe<Scalars['String']['output']>;
	id: Scalars['ID']['output'];
	name: Scalars['String']['output'];
	resolved: Scalars['Boolean']['output'];
	updatedAt?: Maybe<Scalars['String']['output']>;
};

export type RiskEdge = {
	__typename?: 'RiskEdge';
	cursor: Scalars['String']['output'];
	node: Risk;
};

export type RisksConnection = {
	__typename?: 'RisksConnection';
	edges: Array<RiskEdge>;
	pageInfo: PageInfo;
};

export type GetCategoriesQueryVariables = Exact<{
	createdBy?: InputMaybe<Scalars['String']['input']>;
	first?: InputMaybe<Scalars['Int']['input']>;
	after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetCategoriesQuery = {
	__typename?: 'Query';
	categories: {
		__typename?: 'CategoriesConnection';
		edges: Array<{
			__typename?: 'CategoryEdge';
			cursor: string;
			node: {
				__typename?: 'Category';
				id: string;
				name: string;
				description?: string | null;
				createdBy: string;
				createdAt?: string | null;
				updatedAt?: string | null;
			};
		}>;
		pageInfo: {
			__typename?: 'PageInfo';
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor?: string | null;
			endCursor?: string | null;
			totalCount?: number | null;
		};
	};
};

export type GetAllCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllCategoriesQuery = {
	__typename?: 'Query';
	allCategories: Array<{
		__typename?: 'Category';
		id: string;
		name: string;
		description?: string | null;
		createdBy: string;
		createdAt?: string | null;
		updatedAt?: string | null;
	}>;
};

export type DeleteCategoryMutationVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type DeleteCategoryMutation = { __typename?: 'Mutation'; deleteCategory: boolean };

export type CreateCategoryMutationVariables = Exact<{
	name: Scalars['String']['input'];
	description?: InputMaybe<Scalars['String']['input']>;
	createdBy: Scalars['String']['input'];
}>;

export type CreateCategoryMutation = {
	__typename?: 'Mutation';
	createCategory: { __typename?: 'Category'; id: string; name: string; description?: string | null; createdBy: string };
};

export type UpdateCategoryMutationVariables = Exact<{
	id: Scalars['ID']['input'];
	name?: InputMaybe<Scalars['String']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateCategoryMutation = {
	__typename?: 'Mutation';
	updateCategory: {
		__typename?: 'Category';
		id: string;
		name: string;
		description?: string | null;
		createdBy: string;
		createdAt?: string | null;
		updatedAt?: string | null;
	};
};

export type GetRisksQueryVariables = Exact<{
	createdBy?: InputMaybe<Scalars['String']['input']>;
	first?: InputMaybe<Scalars['Int']['input']>;
	after?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetRisksQuery = {
	__typename?: 'Query';
	risks: {
		__typename?: 'RisksConnection';
		edges: Array<{
			__typename?: 'RiskEdge';
			cursor: string;
			node: {
				__typename?: 'Risk';
				id: string;
				name: string;
				description?: string | null;
				resolved: boolean;
				createdBy: string;
				createdAt?: string | null;
				updatedAt?: string | null;
				category?: { __typename?: 'Category'; id: string; name: string } | null;
			};
		}>;
		pageInfo: {
			__typename?: 'PageInfo';
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor?: string | null;
			endCursor?: string | null;
			totalCount?: number | null;
		};
	};
};

export type DeleteRiskMutationVariables = Exact<{
	id: Scalars['ID']['input'];
}>;

export type DeleteRiskMutation = { __typename?: 'Mutation'; deleteRisk: boolean };

export type CreateRiskMutationVariables = Exact<{
	name: Scalars['String']['input'];
	description?: InputMaybe<Scalars['String']['input']>;
	categoryId: Scalars['ID']['input'];
	createdBy: Scalars['String']['input'];
	resolved?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type CreateRiskMutation = {
	__typename?: 'Mutation';
	createRisk: { __typename?: 'Risk'; id: string; name: string; description?: string | null; categoryId: string; resolved: boolean; createdBy: string };
};

export type UpdateRiskMutationVariables = Exact<{
	id: Scalars['ID']['input'];
	name?: InputMaybe<Scalars['String']['input']>;
	description?: InputMaybe<Scalars['String']['input']>;
	categoryId?: InputMaybe<Scalars['ID']['input']>;
	resolved?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type UpdateRiskMutation = {
	__typename?: 'Mutation';
	updateRisk: {
		__typename?: 'Risk';
		id: string;
		name: string;
		description?: string | null;
		resolved: boolean;
		createdBy: string;
		createdAt?: string | null;
		updatedAt?: string | null;
		category?: { __typename?: 'Category'; id: string; name: string } | null;
	};
};

export const GetCategoriesDocument = gql`
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

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *      createdBy: // value for 'createdBy'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
}
export function useGetCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
}
export function useGetCategoriesSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>
) {
	const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
	return Apollo.useSuspenseQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, options);
}
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetCategoriesSuspenseQuery>;
export type GetCategoriesQueryResult = ApolloTypes.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetAllCategoriesDocument = gql`
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

/**
 * __useGetAllCategoriesQuery__
 *
 * To run a query within a React component, call `useGetAllCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>(GetAllCategoriesDocument, options);
}
export function useGetAllCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useLazyQuery<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>(GetAllCategoriesDocument, options);
}
export function useGetAllCategoriesSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>
) {
	const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
	return Apollo.useSuspenseQuery<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>(GetAllCategoriesDocument, options);
}
export type GetAllCategoriesQueryHookResult = ReturnType<typeof useGetAllCategoriesQuery>;
export type GetAllCategoriesLazyQueryHookResult = ReturnType<typeof useGetAllCategoriesLazyQuery>;
export type GetAllCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetAllCategoriesSuspenseQuery>;
export type GetAllCategoriesQueryResult = Apollo.QueryResult<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>;
export const DeleteCategoryDocument = gql`
	mutation DeleteCategory($id: ID!) {
		deleteCategory(id: $id)
	}
`;
export type DeleteCategoryMutationFn = ApolloTypes.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
}
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = ApolloTypes.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const CreateCategoryDocument = gql`
	mutation CreateCategory($name: String!, $description: String, $createdBy: String!) {
		createCategory(name: $name, description: $description, createdBy: $createdBy) {
			id
			name
			description
			createdBy
		}
	}
`;
export type CreateCategoryMutationFn = Apollo.MutationFunction<CreateCategoryMutation, CreateCategoryMutationVariables>;

/**
 * __useCreateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCategoryMutation, { data, loading, error }] = useCreateCategoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      createdBy: // value for 'createdBy'
 *   },
 * });
 */
export function useCreateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateCategoryMutation, CreateCategoryMutationVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<CreateCategoryMutation, CreateCategoryMutationVariables>(CreateCategoryDocument, options);
}
export type CreateCategoryMutationHookResult = ReturnType<typeof useCreateCategoryMutation>;
export type CreateCategoryMutationResult = Apollo.MutationResult<CreateCategoryMutation>;
export type CreateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = gql`
	mutation UpdateCategory($id: ID!, $name: String, $description: String) {
		updateCategory(id: $id, name: $name, description: $description) {
			id
			name
			description
			createdBy
			createdAt
			updatedAt
		}
	}
`;
export type UpdateCategoryMutationFn = Apollo.MutationFunction<UpdateCategoryMutation, UpdateCategoryMutationVariables>;

/**
 * __useUpdateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCategoryMutation, { data, loading, error }] = useUpdateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, options);
}
export type UpdateCategoryMutationHookResult = ReturnType<typeof useUpdateCategoryMutation>;
export type UpdateCategoryMutationResult = Apollo.MutationResult<UpdateCategoryMutation>;
export type UpdateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const GetRisksDocument = gql`
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

/**
 * __useGetRisksQuery__
 *
 * To run a query within a React component, call `useGetRisksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRisksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRisksQuery({
 *   variables: {
 *      createdBy: // value for 'createdBy'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetRisksQuery(baseOptions?: Apollo.QueryHookOptions<GetRisksQuery, GetRisksQueryVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useQuery<GetRisksQuery, GetRisksQueryVariables>(GetRisksDocument, options);
}
export function useGetRisksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRisksQuery, GetRisksQueryVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useLazyQuery<GetRisksQuery, GetRisksQueryVariables>(GetRisksDocument, options);
}
export function useGetRisksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRisksQuery, GetRisksQueryVariables>) {
	const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
	return Apollo.useSuspenseQuery<GetRisksQuery, GetRisksQueryVariables>(GetRisksDocument, options);
}
export type GetRisksQueryHookResult = ReturnType<typeof useGetRisksQuery>;
export type GetRisksLazyQueryHookResult = ReturnType<typeof useGetRisksLazyQuery>;
export type GetRisksSuspenseQueryHookResult = ReturnType<typeof useGetRisksSuspenseQuery>;
export type GetRisksQueryResult = Apollo.QueryResult<GetRisksQuery, GetRisksQueryVariables>;
export const DeleteRiskDocument = gql`
	mutation DeleteRisk($id: ID!) {
		deleteRisk(id: $id)
	}
`;
export type DeleteRiskMutationFn = Apollo.MutationFunction<DeleteRiskMutation, DeleteRiskMutationVariables>;

/**
 * __useDeleteRiskMutation__
 *
 * To run a mutation, you first call `useDeleteRiskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRiskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRiskMutation, { data, loading, error }] = useDeleteRiskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRiskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRiskMutation, DeleteRiskMutationVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<DeleteRiskMutation, DeleteRiskMutationVariables>(DeleteRiskDocument, options);
}
export type DeleteRiskMutationHookResult = ReturnType<typeof useDeleteRiskMutation>;
export type DeleteRiskMutationResult = Apollo.MutationResult<DeleteRiskMutation>;
export type DeleteRiskMutationOptions = Apollo.BaseMutationOptions<DeleteRiskMutation, DeleteRiskMutationVariables>;
export const CreateRiskDocument = gql`
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
export type CreateRiskMutationFn = Apollo.MutationFunction<CreateRiskMutation, CreateRiskMutationVariables>;

/**
 * __useCreateRiskMutation__
 *
 * To run a mutation, you first call `useCreateRiskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRiskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRiskMutation, { data, loading, error }] = useCreateRiskMutation({
 *   variables: {
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      categoryId: // value for 'categoryId'
 *      createdBy: // value for 'createdBy'
 *      resolved: // value for 'resolved'
 *   },
 * });
 */
export function useCreateRiskMutation(baseOptions?: Apollo.MutationHookOptions<CreateRiskMutation, CreateRiskMutationVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<CreateRiskMutation, CreateRiskMutationVariables>(CreateRiskDocument, options);
}
export type CreateRiskMutationHookResult = ReturnType<typeof useCreateRiskMutation>;
export type CreateRiskMutationResult = Apollo.MutationResult<CreateRiskMutation>;
export type CreateRiskMutationOptions = Apollo.BaseMutationOptions<CreateRiskMutation, CreateRiskMutationVariables>;
export const UpdateRiskDocument = gql`
	mutation UpdateRisk($id: ID!, $name: String, $description: String, $categoryId: ID, $resolved: Boolean) {
		updateRisk(id: $id, name: $name, description: $description, categoryId: $categoryId, resolved: $resolved) {
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
export type UpdateRiskMutationFn = Apollo.MutationFunction<UpdateRiskMutation, UpdateRiskMutationVariables>;

/**
 * __useUpdateRiskMutation__
 *
 * To run a mutation, you first call `useUpdateRiskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRiskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRiskMutation, { data, loading, error }] = useUpdateRiskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *      categoryId: // value for 'categoryId'
 *      resolved: // value for 'resolved'
 *   },
 * });
 */
export function useUpdateRiskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRiskMutation, UpdateRiskMutationVariables>) {
	const options = { ...defaultOptions, ...baseOptions };
	return Apollo.useMutation<UpdateRiskMutation, UpdateRiskMutationVariables>(UpdateRiskDocument, options);
}
export type UpdateRiskMutationHookResult = ReturnType<typeof useUpdateRiskMutation>;
export type UpdateRiskMutationResult = Apollo.MutationResult<UpdateRiskMutation>;
export type UpdateRiskMutationOptions = Apollo.BaseMutationOptions<UpdateRiskMutation, UpdateRiskMutationVariables>;
