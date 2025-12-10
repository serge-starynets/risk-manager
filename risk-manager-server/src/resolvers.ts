import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { Risk, IRiskDocument } from './models/risk.js';
import { Category, ICategoryDocument } from './models/category.js';
import type DataLoader from 'dataloader';

const RISKS_LIMIT = 15;
const CATEGORIES_LIMIT = 15;

export interface GraphQLContext {
	categoryLoader: DataLoader<string | mongoose.Types.ObjectId, ICategoryDocument | null>;
}

interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null;
	endCursor: string | null;
	totalCount: number;
}

interface RiskEdge {
	node: IRiskDocument;
	cursor: string;
}

interface RisksConnection {
	edges: RiskEdge[];
	pageInfo: PageInfo;
}

interface CategoryEdge {
	node: ICategoryDocument;
	cursor: string;
}

interface CategoriesConnection {
	edges: CategoryEdge[];
	pageInfo: PageInfo;
}

const assertValidId = (id: string, entity: string): void => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new GraphQLError(`Invalid ${entity} id`, { extensions: { code: 'BAD_USER_INPUT' } });
	}
};

const requireName = (name: string | undefined, entity: string): string => {
	if (!name || !name.trim()) {
		throw new GraphQLError(`${entity} name cannot be empty`, { extensions: { code: 'BAD_USER_INPUT' } });
	}
	return name.trim();
};

export const resolvers = {
	Query: {
		risks: async (
			_: unknown,
			{ createdBy, first = RISKS_LIMIT, after }: { createdBy?: string | null; first?: number; after?: string | null },
			__: GraphQLContext
		): Promise<RisksConnection> => {
			const limit = Math.min(first || RISKS_LIMIT, RISKS_LIMIT);
			const query: Record<string, unknown> = createdBy ? { createdBy } : {};

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
				const previousQuery: Record<string, unknown> = {
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
		risk: async (_: unknown, { id }: { id: string }, __: GraphQLContext): Promise<IRiskDocument | null> => {
			return await Risk.findById(id);
		},
		categories: async (
			_: unknown,
			{ createdBy, first = CATEGORIES_LIMIT, after }: { createdBy?: string | null; first?: number; after?: string | null },
			__: GraphQLContext
		): Promise<CategoriesConnection> => {
			const limit = Math.min(first || CATEGORIES_LIMIT, CATEGORIES_LIMIT);
			const query: Record<string, unknown> = createdBy ? { createdBy } : {};

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
				const previousQuery: Record<string, unknown> = {
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
		allCategories: async (_: unknown, __: unknown, ___: GraphQLContext): Promise<ICategoryDocument[]> => {
			return await Category.find().sort({ createdAt: -1 });
		},
		category: async (_: unknown, { id }: { id: string }, __: GraphQLContext): Promise<ICategoryDocument | null> => {
			return await Category.findById(id);
		},
	},

	Mutation: {
		createRisk: async (
			_: unknown,
			{
				name,
				description,
				categoryId,
				createdBy,
				resolved,
			}: { name: string; description?: string | null; categoryId: string; createdBy: string; resolved?: boolean | null },
			__: GraphQLContext
		): Promise<IRiskDocument> => {
			const trimmedName = requireName(name, 'Risk');
			const risk = new Risk({ name: trimmedName, description: description || undefined, categoryId, createdBy, resolved: resolved ?? false });
			await risk.save();
			return risk;
		},
		deleteRisk: async (_: unknown, { id }: { id: string }, __: GraphQLContext): Promise<boolean> => {
			assertValidId(id, 'risk');
			const risk = await Risk.findById(id);
			if (!risk) {
				throw new GraphQLError('Risk not found for given id', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}
			await Risk.findByIdAndDelete(id);
			return true;
		},
		updateRisk: async (
			_: unknown,
			{
				id,
				name,
				description,
				categoryId,
				resolved,
			}: { id: string; name?: string | null; description?: string | null; categoryId?: string | null; resolved?: boolean | null },
			__: GraphQLContext
		): Promise<IRiskDocument> => {
			assertValidId(id, 'risk');
			const update: Record<string, unknown> = {};
			if (description !== undefined) {
				update.description = description || undefined;
			}
			if (categoryId !== undefined) {
				update.categoryId = categoryId || undefined;
			}
			if (resolved !== undefined) {
				update.resolved = resolved ?? false;
			}
			if (name !== undefined && name !== null) {
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
		createCategory: async (
			_: unknown,
			{ name, description, createdBy }: { name: string; description?: string | null; createdBy: string },
			__: GraphQLContext
		): Promise<ICategoryDocument> => {
			const trimmedName = requireName(name, 'Category');
			const category = new Category({ name: trimmedName, description: description || undefined, createdBy });
			await category.save();
			return category;
		},
		deleteCategory: async (_: unknown, { id }: { id: string }, __: GraphQLContext): Promise<boolean> => {
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
		updateCategory: async (
			_: unknown,
			{ id, name, description }: { id: string; name?: string | null; description?: string | null },
			__: GraphQLContext
		): Promise<ICategoryDocument> => {
			assertValidId(id, 'category');
			const update: Record<string, unknown> = {};
			if (description !== undefined) {
				update.description = description || undefined;
			}
			if (name !== undefined && name !== null) {
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
		id: (parent: IRiskDocument): string => parent._id.toString(),
		category: async (parent: IRiskDocument, _: unknown, context: GraphQLContext): Promise<ICategoryDocument | null> => {
			if (!parent.categoryId) return null;
			// Use DataLoader to batch category queries and avoid N+1 problem
			return await context.categoryLoader.load(parent.categoryId);
		},
	},
	Category: {
		id: (parent: ICategoryDocument): string => parent._id.toString(),
	},
};
