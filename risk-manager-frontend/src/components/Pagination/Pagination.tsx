import type { PageInfo } from '../../api/types';

interface PaginationProps {
	pageInfo: PageInfo | null | undefined;
	currentPage: number;
	pageSize: number;
	totalCount: number;
	itemCount: number;
	entityName: {
		singular: string;
		plural: string;
	};
	onNext: () => void;
	onPrevious: () => void;
	canGoPrevious: boolean;
}

const Pagination = ({ pageInfo, currentPage, pageSize, totalCount, itemCount, entityName, onNext, onPrevious, canGoPrevious }: PaginationProps) => {
	if (!pageInfo) {
		return null;
	}

	// Calculate the range of items being displayed (1-indexed)
	const startRange = currentPage * pageSize + 1;
	const endRange = currentPage * pageSize + itemCount;

	return (
		<div className="mt-4 flex items-center justify-between">
			<button
				onClick={onPrevious}
				disabled={!canGoPrevious}
				className={`px-4 py-2 text-sm font-medium rounded-md ${
					canGoPrevious ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
				} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
			>
				Previous
			</button>
			<span className="text-sm text-gray-700">
				Showing {startRange} - {endRange} of {totalCount} {totalCount === 1 ? entityName.singular : entityName.plural}
			</span>
			<button
				onClick={onNext}
				disabled={!pageInfo.hasNextPage}
				className={`px-4 py-2 text-sm font-medium rounded-md ${
					pageInfo.hasNextPage ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
				} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
			>
				Next
			</button>
		</div>
	);
};

export default Pagination;
