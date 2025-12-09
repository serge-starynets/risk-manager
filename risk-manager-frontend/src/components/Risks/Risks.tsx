import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_RISKS, DELETE_RISK, CREATE_RISK, UPDATE_RISK } from '../../api/queries/riskQueries';
import { GET_ALL_CATEGORIES } from '../../api/queries/categoryQueries';
import type { Category, RisksConnection } from '../../api/types';
import { useUser } from '../../contexts/UserContext';
import ConfirmDialog from '../ConfirmDialog';
import AddRiskForm from '../AddRiskForm';
import { toast } from 'react-toastify';

const PAGE_SIZE = 15;

const Risks = () => {
	const { username } = useUser();
	const [deleteRiskId, setDeleteRiskId] = useState<string | null>(null);
	const [isAddFormOpen, setIsAddFormOpen] = useState(false);
	const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
	const [showAllRisks, setShowAllRisks] = useState(false);
	const [cursor, setCursor] = useState<string | null>(null);
	const [cursorHistory, setCursorHistory] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const { loading, error, data, refetch } = useQuery<{ risks: RisksConnection }>(GET_RISKS, {
		variables: { createdBy: showAllRisks ? null : username || null, first: PAGE_SIZE, after: cursor },
		skip: !username,
	});

	const { data: categoriesData } = useQuery<{ allCategories: Category[] }>(GET_ALL_CATEGORIES);

	const allRisks = data?.risks?.edges?.map((edge) => edge.node) || [];
	const totalCount = data?.risks?.pageInfo?.totalCount || 0;
	const risks = showOnlyUnresolved ? allRisks.filter((risk) => !risk.resolved) : allRisks;
	const categories = categoriesData?.allCategories || [];
	const pageInfo = data?.risks?.pageInfo;

	// Calculate the range of items being displayed (1-indexed)
	const startRange = currentPage * PAGE_SIZE + 1;
	const endRange = currentPage * PAGE_SIZE + allRisks.length;

	const [deleteRisk] = useMutation(DELETE_RISK, {
		onCompleted: () => {
			setDeleteRiskId(null);
			toast.success('Risk deleted successfully');
			refetch();
		},
		onError: (error) => {
			toast.error('Error deleting risk: ' + error.message);
		},
	});

	const [createRisk] = useMutation(CREATE_RISK, {
		onCompleted: () => {
			setIsAddFormOpen(false);
			toast.success('Risk created successfully');
			setCursor(null); // Reset to first page
			setCursorHistory([]); // Clear history
			setCurrentPage(0); // Reset to first page
			refetch();
		},
		onError: (error) => {
			toast.error('Error creating risk: ' + error.message);
		},
	});

	const [updateRisk] = useMutation(UPDATE_RISK, {
		onCompleted: () => {
			refetch();
		},
	});

	const handleDeleteClick = (riskId: string) => {
		setDeleteRiskId(riskId);
	};

	const handleConfirmDelete = () => {
		if (deleteRiskId) {
			deleteRisk({ variables: { id: deleteRiskId } });
		}
	};

	const handleCancelDelete = () => {
		setDeleteRiskId(null);
	};

	const handleAddRisk = (formData: { name: string; description: string; categoryId: string; resolved: boolean }) => {
		if (username) {
			createRisk({
				variables: {
					name: formData.name,
					description: formData.description || null,
					categoryId: formData.categoryId,
					createdBy: username,
					resolved: formData.resolved,
				},
			});
		}
	};

	const handleStatusToggle = (riskId: string, currentStatus: boolean) => {
		updateRisk({
			variables: {
				id: riskId,
				resolved: !currentStatus,
			},
		});
	};

	if (loading) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">Loading risks...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">Error loading risks: {error.message}</p>
			</div>
		);
	}

	const handleNextPage = () => {
		if (pageInfo?.hasNextPage && pageInfo?.endCursor) {
			// Save current cursor to history before moving forward
			if (cursor) {
				setCursorHistory((prev) => [...prev, cursor]);
			}
			setCursor(pageInfo.endCursor);
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousPage = () => {
		if (cursorHistory.length > 0) {
			// Go back to previous cursor
			const previousCursors = [...cursorHistory];
			const previousCursor = previousCursors.pop();
			setCursorHistory(previousCursors);
			setCursor(previousCursor || null);
			setCurrentPage(currentPage - 1);
		} else {
			// Go back to first page
			setCursor(null);
			setCursorHistory([]);
			setCurrentPage(0);
		}
	};

	return (
		<>
			<ConfirmDialog
				isOpen={deleteRiskId !== null}
				title="Delete Confirmation"
				entity="Risk"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				confirmText="Confirm"
				cancelText="Cancel"
			/>
			<AddRiskForm isOpen={isAddFormOpen} categories={categories} onClose={() => setIsAddFormOpen(false)} onSubmit={handleAddRisk} />
			<div className="mb-4 flex justify-start items-center gap-4">
				<button
					onClick={() => setIsAddFormOpen(true)}
					className="px-4 py-2 text-sm font-medium text-white bg-blue-600 cursor-pointer rounded-md hover:bg-blue-700 
					focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
				>
					Add Risk
				</button>
				<button
					onClick={() => {
						setShowAllRisks(!showAllRisks);
						setCursor(null);
						setCursorHistory([]);
						setCurrentPage(0);
					}}
					className="px-4 py-2 text-sm font-medium text-white bg-green-600 cursor-pointer rounded-md hover:bg-green-700 
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
				>
					{showAllRisks ? "Show current user's risks" : 'Show all risks'}
				</button>
				<label className="flex items-center gap-2 cursor-pointer">
					<span className="text-sm text-gray-700">Show only unresolved</span>
					<div className="relative">
						<input
							type="checkbox"
							checked={showOnlyUnresolved}
							onChange={(e) => {
								setShowOnlyUnresolved(e.target.checked);
								setCursor(null);
								setCursorHistory([]);
								setCurrentPage(0);
							}}
							className="sr-only"
						/>
						<div
							className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${showOnlyUnresolved ? 'bg-blue-600' : 'bg-gray-300'}`}
						>
							<div
								className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
									showOnlyUnresolved ? 'translate-x-5' : 'translate-x-0.5'
								} mt-0.5`}
							/>
						</div>
					</div>
				</label>
			</div>
			<div className={`overflow-x-auto`}>
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{risks.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-6 py-4 text-center text-gray-500">
									No risks available
								</td>
							</tr>
						) : (
							risks.map((risk) => (
								<tr key={risk.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.name}</td>
									<td className="px-6 py-4 text-sm text-gray-500">{risk.description || '-'}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.category?.name || 'no category'}</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											onClick={() => handleStatusToggle(risk.id, risk.resolved)}
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors hover:opacity-80 ${
												risk.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
											}`}
										>
											{risk.resolved ? 'Resolved' : 'Unresolved'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.createdBy}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<button
											onClick={() => handleDeleteClick(risk.id)}
											className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 
											rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 
											focus:ring-offset-2 transition-colors cursor-pointer"
										>
											Delete
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			{pageInfo && (
				<div className="mt-4 flex items-center justify-between">
					<button
						onClick={handlePreviousPage}
						disabled={cursor === null && cursorHistory.length === 0}
						className={`px-4 py-2 text-sm font-medium rounded-md ${
							cursor !== null || cursorHistory.length > 0
								? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
					>
						Previous
					</button>
					<span className="text-sm text-gray-700">
						Showing {startRange} - {endRange} of {totalCount} {totalCount === 1 ? 'risk' : 'risks'}
					</span>
					<button
						onClick={handleNextPage}
						disabled={!pageInfo.hasNextPage}
						className={`px-4 py-2 text-sm font-medium rounded-md ${
							pageInfo.hasNextPage ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
						} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
					>
						Next
					</button>
				</div>
			)}
		</>
	);
};

export default Risks;
