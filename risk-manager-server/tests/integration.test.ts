import { beforeAll, afterAll, beforeEach, afterEach, describe, expect, it } from 'vitest';

import { setupTestServer, teardownTestServer, seedTestData, resetTestDB } from './test-setup';
import type { ApolloServer } from '@apollo/server';
import type { GraphQLContext } from '../src/resolvers.ts';

let server: ApolloServer<GraphQLContext> | undefined;
let createContext: (() => GraphQLContext) | undefined;
let seeded: { categories: Array<{ _id: { toString: () => string } }>; risks: Array<{ _id: { toString: () => string } }> } | undefined;

// Helper function to ensure test setup is complete
function ensureSetup() {
	if (!server || !createContext) {
		throw new Error('Test setup incomplete: server or createContext not initialized');
	}
	return { server, createContext };
}

function ensureSeeded() {
	if (!seeded) {
		throw new Error('Test setup incomplete: seeded data not available');
	}
	return seeded;
}

// Type guard for GraphQL single result
function assertSingleResult<T>(body: { kind: string }): asserts body is { kind: 'single'; singleResult: T } {
	if (body.kind !== 'single') {
		throw new Error(`Expected single result, got ${body.kind}`);
	}
}

describe('Integration tests', () => {
	beforeAll(async () => {
		const setup = await setupTestServer();
		server = setup.server;
		createContext = setup.createContext;
	});

	beforeEach(async () => {
		await resetTestDB();
		seeded = await seedTestData();
	});

	afterEach(async () => {
		await resetTestDB();
	});

	afterAll(async () => {
		await teardownTestServer();
	});

	it('returns seeded categories with pagination info', async () => {
		const { server, createContext } = ensureSetup();
		const res = await server.executeOperation(
			{
				query: `
					query Categories {
						categories(first: 10) {
							pageInfo {
								totalCount
								hasNextPage
								hasPreviousPage
							}
							edges {
								node {
									id
									name
									description
									createdBy
								}
							}
						}
					}
				`,
			},
			{ contextValue: createContext() }
		);

		expect(res.body.kind).toBe('single');
		assertSingleResult(res.body);
		const data = res.body.singleResult.data as any;
		expect(data).toBeDefined();
		expect(data.categories.pageInfo.totalCount).toBe(2);
		expect(data.categories.pageInfo.hasNextPage).toBe(false);
		expect(data.categories.pageInfo.hasPreviousPage).toBe(false);
		expect(data.categories.edges).toHaveLength(2);
		const names = data.categories.edges.map((edge: { node: { name: string } }) => edge.node.name).sort();
		expect(names).toEqual(['Engineering', 'Operations']);
	});

	it('creates a risk and resolves category through DataLoader', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const createRes = await server.executeOperation(
			{
				query: `
					mutation CreateRisk(
						$name: String!
						$description: String
						$categoryId: ID!
						$createdBy: String!
						$resolved: Boolean
					) {
						createRisk(
							name: $name
							description: $description
							categoryId: $categoryId
							createdBy: $createdBy
							resolved: $resolved
						) {
							id
							name
							categoryId
							resolved
							createdBy
						}
					}
				`,
				variables: {
					name: 'New production issue',
					description: 'A deployment failed',
					categoryId: seeded.categories[0]._id.toString(),
					createdBy: 'tester',
					resolved: false,
				},
			},
			{ contextValue: createContext() }
		);

		expect(createRes.body.kind).toBe('single');
		assertSingleResult(createRes.body);
		const createdRisk = (createRes.body.singleResult.data as any)?.createRisk;
		expect(createdRisk).toBeDefined();
		expect(createdRisk.name).toBe('New production issue');
		expect(createdRisk.categoryId).toBe(seeded.categories[0]._id.toString());

		const queryRes = await server.executeOperation(
			{
				query: `
					query Risks($after: String) {
						risks(first: 10, after: $after) {
							pageInfo {
								totalCount
								hasNextPage
							}
							edges {
								node {
									id
									name
									resolved
									category {
										id
										name
									}
								}
							}
						}
					}
				`,
			},
			{ contextValue: createContext() }
		);

		expect(queryRes.body.kind).toBe('single');
		assertSingleResult(queryRes.body);
		const risks = (queryRes.body.singleResult.data as any)?.risks;
		expect(risks).toBeDefined();
		expect(risks.pageInfo.totalCount).toBe(4);
		expect(risks.pageInfo.hasNextPage).toBe(false);
		expect(risks.edges.length).toBe(4);
		const riskWithCategory = risks.edges.find((edge: any) => edge.node.id === createdRisk.id);
		expect(riskWithCategory.node.category.name).toBe('Engineering');
	});

	it('updates risk name and description', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const targetRisk = seeded.risks[0];
		const updatedName = 'DB outage mitigated';
		const updatedDescription = 'New backup cluster online';

		const updateRes = await server.executeOperation(
			{
				query: `
					mutation UpdateRisk(
						$id: ID!
						$name: String
						$description: String
						$categoryId: ID
						$resolved: Boolean
					) {
						updateRisk(
							id: $id
							name: $name
							description: $description
							categoryId: $categoryId
							resolved: $resolved
						) {
							id
							name
							description
							resolved
							categoryId
						}
					}
				`,
				variables: {
					id: targetRisk._id.toString(),
					name: updatedName,
					description: updatedDescription,
					resolved: true,
				},
			},
			{ contextValue: createContext() }
		);

		expect(updateRes.body.kind).toBe('single');
		assertSingleResult(updateRes.body);
		const updatedRisk = (updateRes.body.singleResult.data as any)?.updateRisk;
		expect(updatedRisk).toBeDefined();
		expect(updatedRisk.name).toBe(updatedName);
		expect(updatedRisk.description).toBe(updatedDescription);
		expect(updatedRisk.resolved).toBe(true);
	});

	it('updates category name and description', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const targetCategory = seeded.categories[1];
		const newName = 'Ops';
		const newDescription = 'Process and vendor related';

		const updateRes = await server.executeOperation(
			{
				query: `
					mutation UpdateCategory($id: ID!, $name: String, $description: String) {
						updateCategory(id: $id, name: $name, description: $description) {
							id
							name
							description
						}
					}
				`,
				variables: {
					id: targetCategory._id.toString(),
					name: newName,
					description: newDescription,
				},
			},
			{ contextValue: createContext() }
		);

		expect(updateRes.body.kind).toBe('single');
		assertSingleResult(updateRes.body);
		const updatedCategory = (updateRes.body.singleResult.data as any)?.updateCategory;
		expect(updatedCategory).toBeDefined();
		expect(updatedCategory.name).toBe(newName);
		expect(updatedCategory.description).toBe(newDescription);
	});

	it('successfully deletes risk', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const targetRisk = seeded.risks[1];

		const deleteRes = await server.executeOperation(
			{
				query: `
					mutation DeleteRisk($id: ID!) {
						deleteRisk(id: $id)
					}
				`,
				variables: { id: targetRisk._id.toString() },
			},
			{ contextValue: createContext() }
		);

		expect(deleteRes.body.kind).toBe('single');
		assertSingleResult(deleteRes.body);
		expect((deleteRes.body.singleResult.data as any)?.deleteRisk).toBe(true);

		const queryRes = await server.executeOperation(
			{
				query: `
					query Risks {
						risks(first: 10) {
							pageInfo { totalCount }
							edges { node { id } }
						}
					}
				`,
			},
			{ contextValue: createContext() }
		);

		expect(queryRes.body.kind).toBe('single');
		assertSingleResult(queryRes.body);
		const risks = (queryRes.body.singleResult.data as any)?.risks;
		expect(risks).toBeDefined();
		expect(risks.pageInfo.totalCount).toBe(2);
		expect(risks.edges.map((edge: any) => edge.node.id)).not.toContain(targetRisk._id.toString());
	});

	it('throws meaningful error if delete risk with nonexistent id', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const targetRisk = seeded.risks[1];

		const deleteRes = await server.executeOperation(
			{
				query: `
					mutation DeleteRisk($id: ID!) {
						deleteRisk(id: $id)
					}
				`,
				variables: { id: '123' },
			},
			{ contextValue: createContext() }
		);
		expect(deleteRes.body.kind).toBe('single');
		assertSingleResult(deleteRes.body);
		expect((deleteRes.body.singleResult.errors as any)?.[0]?.message).toBe('Invalid risk id');

		const queryRes = await server.executeOperation(
			{
				query: `
					query Risks {
						risks(first: 10) {
							pageInfo { totalCount }
							edges { node { id } }
						}
					}
				`,
			},
			{ contextValue: createContext() }
		);

		expect(queryRes.body.kind).toBe('single');
		assertSingleResult(queryRes.body);
		const risks = (queryRes.body.singleResult.data as any)?.risks;
		expect(risks).toBeDefined();
		expect(risks.pageInfo.totalCount).toBe(3);
		expect(risks.edges.map((edge: any) => edge.node.id)).toContain(targetRisk._id.toString());
	});

	it('successfully deletes category', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const targetCategory = seeded.categories[1];

		const deleteRes = await server.executeOperation(
			{
				query: `
					mutation DeleteCategory($id: ID!) {
						deleteCategory(id: $id)
					}
				`,
				variables: { id: targetCategory._id.toString() },
			},
			{ contextValue: createContext() }
		);

		expect(deleteRes.body.kind).toBe('single');
		assertSingleResult(deleteRes.body);
		expect((deleteRes.body.singleResult.data as any)?.deleteCategory).toBe(true);

		const queryRes = await server.executeOperation(
			{
				query: `
					query Categories {
						categories(first: 10) {
							pageInfo { totalCount }
							edges { node { id name } }
						}
					}
				`,
			},
			{ contextValue: createContext() }
		);

		expect(queryRes.body.kind).toBe('single');
		assertSingleResult(queryRes.body);
		const categories = (queryRes.body.singleResult.data as any)?.categories;
		expect(categories).toBeDefined();
		expect(categories.pageInfo.totalCount).toBe(1);
		expect(categories.edges).toHaveLength(1);
		expect(categories.edges[0].node.name).toBe('Engineering');
	});

	it('throws meaningful error if delete category with nonexistent id', async () => {
		const { server, createContext } = ensureSetup();
		const seeded = ensureSeeded();
		const targetCategory = seeded.categories[0];

		const deleteRes = await server.executeOperation(
			{
				query: `
					mutation DeleteCategory($id: ID!) {
						deleteCategory(id: $id)
					}
				`,
				variables: { id: '123' },
			},
			{ contextValue: createContext() }
		);

		expect((deleteRes.body['singleResult'].errors as any)?.[0]?.message).toBe('Invalid category id');

		const queryRes = await server.executeOperation(
			{
				query: `
					query Categories {
						categories(first: 10) {
							pageInfo { totalCount }
							edges { node { id name } }
						}
					}
				`,
			},
			{ contextValue: createContext() }
		);

		expect(queryRes.body.kind).toBe('single');
		const categories = queryRes.body['singleResult'].data?.categories;
		expect(categories?.pageInfo.totalCount).toBe(2);
		expect(categories?.edges.map((edge: any) => edge.node.id)).toContain(targetCategory._id.toString());
	});
});
