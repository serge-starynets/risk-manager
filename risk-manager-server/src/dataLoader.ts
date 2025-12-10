import DataLoader from 'dataloader';
import { Category, ICategoryDocument } from './models/category.js';
import mongoose from 'mongoose';

export function createCategoryLoader(): DataLoader<string | mongoose.Types.ObjectId, ICategoryDocument | null> {
	return new DataLoader<string | mongoose.Types.ObjectId, ICategoryDocument | null>(async (ids) => {
		// Convert string IDs to ObjectIds for MongoDB query
		const objectIds = ids.map((id) => {
			if (id instanceof mongoose.Types.ObjectId) {
				return id;
			}
			return new mongoose.Types.ObjectId(id);
		});

		// Batch fetch all categories in a single query
		const categories = await Category.find({
			_id: { $in: objectIds },
		});

		// Create a map for O(1) lookup
		const categoryMap = new Map<string, ICategoryDocument>();
		categories.forEach((category) => {
			categoryMap.set(category._id.toString(), category);
		});

		// Return categories in the same order as requested IDs
		// Return null for missing categories
		return ids.map((id) => {
			const idString = id instanceof mongoose.Types.ObjectId ? id.toString() : String(id);
			return categoryMap.get(idString) || null;
		});
	});
}
