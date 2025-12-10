import { beforeAll, afterAll, beforeEach, afterEach, describe, expect, it } from 'vitest';

import { setupTestServer, teardownTestServer, seedTestData, resetTestDB } from './test-setup.js';

let server;
let createContext;
let seeded;

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
		const data = res.body.singleResult.data;
		expect(data.categories.pageInfo.totalCount).toBe(2);
		expect(data.categories.pageInfo.hasNextPage).toBe(false);
		expect(data.categories.pageInfo.hasPreviousPage).toBe(false);
		expect(data.categories.edges).toHaveLength(2);
		const names = data.categories.edges.map((edge) => edge.node.name).sort();
		expect(names).toEqual(['Engineering', 'Operations']);
	});

	it('creates a risk and resolves category through DataLoader', async () => {
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
		const createdRisk = createRes.body.singleResult.data.createRisk;
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
		const risks = queryRes.body.singleResult.data.risks;
		expect(risks.pageInfo.totalCount).toBe(4);
		expect(risks.pageInfo.hasNextPage).toBe(false);
		expect(risks.edges.length).toBe(4);
		const riskWithCategory = risks.edges.find((edge) => edge.node.id === createdRisk.id);
		expect(riskWithCategory.node.category.name).toBe('Engineering');
	});

	it('Updates risk name and description', async () => {
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
		const updatedRisk = updateRes.body.singleResult.data.updateRisk;
		expect(updatedRisk.name).toBe(updatedName);
		expect(updatedRisk.description).toBe(updatedDescription);
		expect(updatedRisk.resolved).toBe(true);
	});

	it('Updates category name and description', async () => {
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
		const updatedCategory = updateRes.body.singleResult.data.updateCategory;
		expect(updatedCategory.name).toBe(newName);
		expect(updatedCategory.description).toBe(newDescription);
	});

	it('Deletes risk', async () => {
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
		expect(deleteRes.body.singleResult.data.deleteRisk).toBe(true);

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
		const risks = queryRes.body.singleResult.data.risks;
		expect(risks.pageInfo.totalCount).toBe(2);
		expect(risks.edges.map((edge) => edge.node.id)).not.toContain(targetRisk._id.toString());
	});

	it('Deletes category', async () => {
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
		expect(deleteRes.body.singleResult.data.deleteCategory).toBe(true);

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
		const categories = queryRes.body.singleResult.data.categories;
		expect(categories.pageInfo.totalCount).toBe(1);
		expect(categories.edges).toHaveLength(1);
		expect(categories.edges[0].node.name).toBe('Engineering');
	});
});
