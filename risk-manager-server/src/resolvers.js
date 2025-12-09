import mongoose from 'mongoose';
import { Risk } from './models/risk.js';
import { Category } from './models/category.js';

export const resolvers = {
	Query: {
		risks: async (_, { createdBy, first = 15, after }) => {
			const limit = Math.min(first || 15, 15);
			const query = createdBy ? { createdBy } : {};

			// If cursor is provided, find risks after that cursor
			// Using _id for cursor since we sort by createdAt descending, we use _id as tiebreaker
			if (after) {
				try {
					if (mongoose.Types.ObjectId.isValid(after)) {
						query._id = { $lt: new mongoose.Types.ObjectId(after) };
					}
				} catch (e) {
					// Invalid cursor, ignore it
				}
			}

			const totalCount = await Risk.countDocuments(createdBy ? { createdBy } : {});

			// Sort by createdAt descending, then by _id descending for consistent pagination
			// Fetch one extra to check if there's a next page
			const risks = await Risk.find(query)
				.sort({ createdAt: -1, _id: -1 })
				.limit(limit + 1);

			const hasNextPage = risks.length > limit;
			const edges = hasNextPage ? risks.slice(0, limit) : risks;

			// Get the first and last cursors (using _id)
			const startCursor = edges.length > 0 ? edges[0]._id.toString() : null;
			const endCursor = edges.length > 0 ? edges[edges.length - 1]._id.toString() : null;

			// Check if there's a previous page
			let hasPreviousPage = false;
			if (after) {
				// If we have a cursor, there's a previous page
				hasPreviousPage = true;
			} else if (startCursor) {
				// Check if there are records before the start cursor
				const previousQuery = {
					$or: [
						{ createdAt: { $gt: edges[0].createdAt } },
						{
							createdAt: edges[0].createdAt,
							_id: { $gt: edges[0]._id },
						},
					],
				};
				if (createdBy) {
					previousQuery.createdBy = createdBy;
				}
				const previousCount = await Risk.countDocuments(previousQuery);
				hasPreviousPage = previousCount > 0;
			}

			return {
				edges: edges.map((risk) => ({
					node: risk,
					cursor: risk._id.toString(),
				})),
				pageInfo: {
					hasNextPage,
					hasPreviousPage,
					startCursor,
					endCursor,
					totalCount,
				},
			};
		},
		risk: async (_, { id }) => await Risk.findById(id),
		categories: async (_, { createdBy, first = 15, after }) => {
			const limit = Math.min(first || 15, 15);
			const query = createdBy ? { createdBy } : {};

			// If cursor is provided, find categories after that cursor
			if (after) {
				try {
					if (mongoose.Types.ObjectId.isValid(after)) {
						query._id = { $lt: new mongoose.Types.ObjectId(after) };
					}
				} catch (e) {
					// Invalid cursor, ignore it
				}
			}

			const totalCount = await Category.countDocuments(createdBy ? { createdBy } : {});

			// Sort by createdAt descending, then by _id descending for consistent pagination
			// Fetch one extra to check if there's a next page
			const categories = await Category.find(query)
				.sort({ createdAt: -1, _id: -1 })
				.limit(limit + 1);

			const hasNextPage = categories.length > limit;
			const edges = hasNextPage ? categories.slice(0, limit) : categories;

			// Get the first and last cursors (using _id)
			const startCursor = edges.length > 0 ? edges[0]._id.toString() : null;
			const endCursor = edges.length > 0 ? edges[edges.length - 1]._id.toString() : null;

			// Check if there's a previous page
			let hasPreviousPage = false;
			if (after) {
				// If we have a cursor, there's a previous page
				hasPreviousPage = true;
			} else if (startCursor) {
				// Check if there are records before the start cursor
				const previousQuery = {
					$or: [
						{ createdAt: { $gt: edges[0].createdAt } },
						{
							createdAt: edges[0].createdAt,
							_id: { $gt: edges[0]._id },
						},
					],
				};
				if (createdBy) {
					previousQuery.createdBy = createdBy;
				}
				const previousCount = await Category.countDocuments(previousQuery);
				hasPreviousPage = previousCount > 0;
			}

			return {
				edges: edges.map((category) => ({
					node: category,
					cursor: category._id.toString(),
				})),
				pageInfo: {
					hasNextPage,
					hasPreviousPage,
					startCursor,
					endCursor,
					totalCount,
				},
			};
		},
		allCategories: async () => await Category.find().sort({ createdAt: -1 }),
		category: async (_, { id }) => await Category.findById(id),
	},

	Mutation: {
		createRisk: async (_, { name, description, categoryId, createdBy, resolved }) => {
			const risk = new Risk({ name, description, categoryId, createdBy, resolved: resolved ?? false });
			await risk.save();
			return risk;
		},
		deleteRisk: async (_, { id }) => {
			await Risk.findByIdAndDelete(id);
			return true;
		},
		updateRisk: async (_, { id, name, description, categoryId, resolved }) => {
			await Risk.findByIdAndUpdate(id, { name, description, categoryId, resolved });
			return await Risk.findById(id);
		},
		createCategory: async (_, { name, description, createdBy }) => {
			const category = new Category({ name, description, createdBy });
			await category.save();
			return category;
		},
		deleteCategory: async (_, { id }) => {
			await Category.findByIdAndDelete(id);
			return true;
		},
		updateCategory: async (_, { id, name, description }) => {
			await Category.findByIdAndUpdate(id, { name, description });
			return await Category.findById(id);
		},
	},

	Risk: {
		id: (parent) => parent._id.toString(),
		category: async (parent, _, context) => {
			if (!parent.categoryId) return null;
			// Use DataLoader to batch category queries and avoid N+1 problem
			return await context.categoryLoader.load(parent.categoryId);
		},
	},
	Category: {
		id: (parent) => parent._id.toString(),
	},
};
