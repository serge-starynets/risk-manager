import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { typeDefs } from '../src/schema.js';
import { resolvers } from '../src/resolvers.js';
import { createCategoryLoader } from '../src/dataLoader.js';
import { Category, ICategoryDocument } from '../src/models/category.js';
import { Risk, IRiskDocument } from '../src/models/risk.js';
import type { GraphQLContext } from '../src/resolvers.js';

let mongod: MongoMemoryServer | undefined;
let server: ApolloServer<GraphQLContext> | undefined;

export async function setupTestServer() {
	mongod = await MongoMemoryServer.create();
	const uri = mongod.getUri();
	await mongoose.connect(uri);

	const createContext = (): GraphQLContext => ({
		categoryLoader: createCategoryLoader(),
	});

	server = new ApolloServer<GraphQLContext>({
		typeDefs,
		resolvers,
	});

	await server.start();

	return {
		server,
		getUri: () => uri,
		createContext,
	};
}

export async function teardownTestServer(): Promise<void> {
	if (mongoose.connection.db) {
		await mongoose.connection.db.dropDatabase();
	}
	await mongoose.disconnect();
	if (mongod) await mongod.stop();
	if (server) await server.stop();
}

export async function resetTestDB(): Promise<void> {
	const { collections } = mongoose.connection;
	// Drop all collections to ensure a clean slate between tests
	for (const name of Object.keys(collections)) {
		await collections[name].deleteMany({});
	}
}

export async function seedTestData(): Promise<{ categories: ICategoryDocument[]; risks: IRiskDocument[] }> {
	const [engineering, operations] = await Category.insertMany([
		{ name: 'Engineering', description: 'Tech risks', createdBy: 'tester' },
		{ name: 'Operations', description: 'Process risks', createdBy: 'tester' },
	]);

	const risks = await Risk.insertMany([
		{
			name: 'Database outage',
			description: 'Primary replica unavailable',
			categoryId: engineering._id,
			createdBy: 'tester',
			resolved: false,
		},
		{
			name: 'Deployment rollback',
			description: 'Rollback due to errors',
			categoryId: engineering._id,
			createdBy: 'tester',
			resolved: true,
		},
		{
			name: 'Vendor delay',
			description: 'Third-party shipping lag',
			categoryId: operations._id,
			createdBy: 'tester',
			resolved: false,
		},
	]);

	return { categories: [engineering, operations], risks };
}
