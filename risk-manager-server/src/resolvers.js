import mongoose from 'mongoose';
import { Risk } from './models/risk.js';
import { Category } from './models/category.js';
import { GraphQLError } from 'graphql';

const RISKS_LIMIT = 15;
const CATEGORIES_LIMIT = 15;

const assertValidId = (id, entity) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new GraphQLError(`Invalid ${entity} id`, { extensions: { code: 'BAD_USER_INPUT' } });
	}
};

const requireName = (name, entity) => {
	if (!name || !name.trim()) {
		throw new GraphQLError(`${entity} name cannot be empty`, { extensions: { code: 'BAD_USER_INPUT' } });
	}
	return name.trim();
};

export const resolvers = {
	Query: {
		risks: async (_, { createdBy, first = RISKS_LIMIT, after }) => {
			const limit = Math.min(first || RISKS_LIMIT, RISKS_LIMIT);
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
		categories: async (_, { createdBy, first = CATEGORIES_LIMIT, after }) => {
			const limit = Math.min(first || CATEGORIES_LIMIT, CATEGORIES_LIMIT);
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
			const trimmedName = requireName(name, 'Risk');
			const risk = new Risk({ name: trimmedName, description, categoryId, createdBy, resolved: resolved ?? false });
			await risk.save();
			return risk;
		},
		deleteRisk: async (_, { id }) => {
			assertValidId(id, 'risk');
			const risk = await Risk.findById(id);
			if (!risk) {
				throw new GraphQLError('Risk not found for given id', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}
			await Risk.findByIdAndDelete(id);
			return true;

			// return false;
		},
		updateRisk: async (_, { id, name, description, categoryId, resolved }) => {
			assertValidId(id, 'risk');
			const update = { description, categoryId, resolved };
			if (name !== undefined) {
				update.name = requireName(name, 'Risk');
			}
			const updatedRisk = await Risk.findByIdAndUpdate(id, update, { new: true });
			if (!updatedRisk) {
				throw new GraphQLError('Risk not found for given id', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}
			return updatedRisk;
		},
		createCategory: async (_, { name, description, createdBy }) => {
			const trimmedName = requireName(name, 'Category');
			const category = new Category({ name: trimmedName, description, createdBy });
			await category.save();
			return category;
		},
		deleteCategory: async (_, { id }) => {
			assertValidId(id, 'category');
			const category = await Category.findById(id);
			if (!category) {
				throw new GraphQLError('Category not found for given id', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}
			await Category.findByIdAndDelete(id);
			return true;
		},
		updateCategory: async (_, { id, name, description }) => {
			assertValidId(id, 'category');
			const update = { description };
			if (name !== undefined) {
				update.name = requireName(name, 'Category');
			}
			const updatedCategory = await Category.findByIdAndUpdate(id, update, { new: true });
			if (!updatedCategory) {
				throw new GraphQLError('Category not found for given id', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}
			return updatedCategory;
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
