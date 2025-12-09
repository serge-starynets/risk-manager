import mongoose from 'mongoose';

export async function connectDB() {
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/risk-manager-db';

	try {
		await mongoose.connect(uri);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error);
		process.exit(1);
	}
}

export default connectDB;
