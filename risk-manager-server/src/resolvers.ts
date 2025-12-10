import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { Risk, IRiskDocument } from './models/risk';
import { Category, ICategoryDocument } from './models/category';
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

interface PaginationParams {
	createdBy?: string | null;
	first?: number;
	after?: string | null;
}

interface PaginationQuery {
	query: Record<string, unknown>;
	limit: number;
}

const buildPaginationQuery = (params: PaginationParams, defaultLimit: number): PaginationQuery => {
	const limit = Math.min(params.first || defaultLimit, defaultLimit);
	const query: Record<string, unknown> = params.createdBy ? { createdBy: params.createdBy } : {};

	// If cursor is provided, find records after that cursor
	if (params.after) {
		try {
			if (mongoose.Types.ObjectId.isValid(params.after)) {
				query._id = { $lt: new mongoose.Types.ObjectId(params.after) };
			}
		} catch (e) {
			// Invalid cursor, ignore it
		}
	}

	return { query, limit };
};

const buildEdges = <T extends { _id: mongoose.Types.ObjectId }>(documents: T[]): Array<{ node: T; cursor: string }> => {
	return documents.map((doc) => ({
		node: doc,
		cursor: doc._id.toString(),
	}));
};

const calculateHasPreviousPage = async <T extends { _id: mongoose.Types.ObjectId; createdAt: Date }>(
	Model: mongoose.Model<T>,
	edges: T[],
	after: string | null | undefined,
	createdBy?: string | null
): Promise<boolean> => {
	if (after) {
		// If we have a cursor, there's a previous page
		return true;
	}

	if (edges.length === 0) {
		return false;
	}

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

	const previousCount = await Model.countDocuments(previousQuery);
	return previousCount > 0;
};

const buildPageInfo = async <T extends { _id: mongoose.Types.ObjectId; createdAt: Date }>(
	Model: mongoose.Model<T>,
	edges: T[],
	hasNextPage: boolean,
	after: string | null | undefined,
	createdBy?: string | null
): Promise<PageInfo> => {
	const startCursor = edges.length > 0 ? edges[0]._id.toString() : null;
	const endCursor = edges.length > 0 ? edges[edges.length - 1]._id.toString() : null;
	const totalCount = await Model.countDocuments(createdBy ? { createdBy } : {});
	const hasPreviousPage = await calculateHasPreviousPage(Model, edges, after, createdBy);

	return {
		hasNextPage,
		hasPreviousPage,
		startCursor,
		endCursor,
		totalCount,
	};
};

export const resolvers = {
	Query: {
		risks: async (_: unknown, { createdBy, first = RISKS_LIMIT, after }: PaginationParams): Promise<RisksConnection> => {
			const { query, limit } = buildPaginationQuery({ createdBy, first, after }, RISKS_LIMIT);

			// Sort by createdAt descending, then by _id descending for consistent pagination
			// Fetch one extra to check if there's a next page
			const risks = await Risk.find(query)
				.sort({ createdAt: -1, _id: -1 })
				.limit(limit + 1);

			const hasNextPage = risks.length > limit;
			const edges = hasNextPage ? risks.slice(0, limit) : risks;

			const pageInfo = await buildPageInfo(Risk, edges, hasNextPage, after, createdBy);

			return {
				edges: buildEdges(edges),
				pageInfo,
			};
		},
		risk: async (_: unknown, { id }: { id: string }): Promise<IRiskDocument | null> => {
			return await Risk.findById(id);
		},
		categories: async (_: unknown, { createdBy, first = CATEGORIES_LIMIT, after }: PaginationParams): Promise<CategoriesConnection> => {
			const { query, limit } = buildPaginationQuery({ createdBy, first, after }, CATEGORIES_LIMIT);

			// Sort by createdAt descending, then by _id descending for consistent pagination
			// Fetch one extra to check if there's a next page
			const categories = await Category.find(query)
				.sort({ createdAt: -1, _id: -1 })
				.limit(limit + 1);

			const hasNextPage = categories.length > limit;
			const edges = hasNextPage ? categories.slice(0, limit) : categories;

			const pageInfo = await buildPageInfo(Category, edges, hasNextPage, after, createdBy);

			return {
				edges: buildEdges(edges),
				pageInfo,
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
			}: {
				name: string;
				description?: string | null;
				categoryId: string;
				createdBy: string;
				resolved?: boolean | null;
			}
		): Promise<IRiskDocument> => {
			const trimmedName = requireName(name, 'Risk');
			const risk = new Risk({ name: trimmedName, description: description || undefined, categoryId, createdBy, resolved: resolved ?? false });
			await risk.save();
			return risk;
		},
		deleteRisk: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
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
			}: {
				id: string;
				name?: string | null;
				description?: string | null;
				categoryId?: string | null;
				resolved?: boolean | null;
			}
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
			{
				name,
				description,
				createdBy,
			}: {
				name: string;
				description?: string | null;
				createdBy: string;
			}
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
			{ id, name, description }: { id: string; name?: string | null; description?: string | null }
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
