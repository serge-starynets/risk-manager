import mongoose from 'mongoose';

export async function connectDB() {
	const uri = process.env.MONGODB_URI;

	if (!uri) {
		console.error('Error: MONGODB_URI environment variable is not set');
		console.error('Please create a .env file with MONGODB_URI=your_connection_string');
		process.exit(1);
	}

	try {
		await mongoose.connect(uri);
		console.log('Connected to MongoDB');

		// Set up connection event handlers for better debugging
		mongoose.connection.on('connected', () => {
			console.log('Connected to MongoDB Atlas');
			console.log(`Database: ${mongoose.connection.name}`);
		});

		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB disconnected');
		});

		// Handle process termination
		process.on('SIGINT', async () => {
			await mongoose.connection.close();
			console.log('MongoDB connection closed due to app termination');
			process.exit(0);
		});
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);

		process.exit(1);
	}
}

export default connectDB;
