import { useState } from 'react';

export interface UsePaginationReturn {
	cursor: string | null;
	cursorHistory: string[];
	currentPage: number;
	canGoPrevious: boolean;
	setCursor: (cursor: string | null) => void;
	setCursorHistory: (history: string[]) => void;
	setCurrentPage: (page: number) => void;
	reset: () => void;
	handleNextPage: (pageInfo: { hasNextPage: boolean; endCursor: string | null }) => void;
	handlePreviousPage: () => void;
}

export const usePagination = (): UsePaginationReturn => {
	const [cursor, setCursor] = useState<string | null>(null);
	const [cursorHistory, setCursorHistory] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(0);

	const reset = () => {
		setCursor(null);
		setCursorHistory([]);
		setCurrentPage(0);
	};

	const handleNextPage = (pageInfo: { hasNextPage: boolean; endCursor: string | null }) => {
		if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
			// Save current cursor to history before moving forward
			if (cursor) {
				setCursorHistory((prev) => [...prev, cursor]);
			}
			setCursor(pageInfo.endCursor);
			setCurrentPage((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (cursorHistory.length > 0) {
			// Go back to previous cursor
			const previousCursors = [...cursorHistory];
			const previousCursor = previousCursors.pop();
			setCursorHistory(previousCursors);
			setCursor(previousCursor || null);
			setCurrentPage((prev) => prev - 1);
		} else {
			// Go back to first page
			reset();
		}
	};

	return {
		cursor,
		cursorHistory,
		currentPage,
		canGoPrevious: cursor !== null || cursorHistory.length > 0,
		setCursor,
		setCursorHistory,
		setCurrentPage,
		reset,
		handleNextPage,
		handlePreviousPage,
	};
};
