import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import connectDB from './db.js';

async function start() {
	try {
		await connectDB();

		const server = new ApolloServer({ typeDefs, resolvers });
		const port = process.env.PORT || 4000;
		const { url } = await startStandaloneServer(server, {
			listen: { port },
		});
		console.log(`Server is running on ${url}`);
	} catch (error) {
		console.error('Error starting server:', error);
		process.exit(1);
	}
}

start();
