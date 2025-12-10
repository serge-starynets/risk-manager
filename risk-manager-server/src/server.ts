import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { createCategoryLoader } from './dataLoader.js';
import connectDB from './db.js';
import type { GraphQLContext } from './resolvers.js';

async function start(): Promise<void> {
	try {
		await connectDB();

		const server = new ApolloServer<GraphQLContext>({
			typeDefs,
			resolvers,
		});

		const port = process.env.PORT || 4000;
		const { url } = await startStandaloneServer(server, {
			listen: { port: Number(port) },
			context: async (): Promise<GraphQLContext> => {
				// Create a new DataLoader instance per request
				// This ensures proper batching and caching within a single request
				return {
					categoryLoader: createCategoryLoader(),
				};
			},
		});
		console.log(`Server is running on ${url}`);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		console.error('Error starting server:', errorMessage);
		process.exit(1);
	}
}

start();
