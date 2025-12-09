export interface Risk {
	id: string;
	name: string;
	description?: string;
	category?: {
		id: string;
		name: string;
	};
	resolved: boolean;
	createdBy: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface Category {
	id: string;
	name: string;
	description?: string;
	createdBy: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PageInfo {
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	startCursor: string | null;
	endCursor: string | null;
	totalCount: number;
}

export interface RiskEdge {
	node: Risk;
	cursor: string;
}

export interface RisksConnection {
	edges: RiskEdge[];
	pageInfo: PageInfo;
}

export interface CategoryEdge {
	node: Category;
	cursor: string;
}

export interface CategoriesConnection {
	edges: CategoryEdge[];
	pageInfo: PageInfo;
}
