import { useState, useMemo, useCallback } from 'react';
import { NetworkStatus } from '@apollo/client';
import { toast } from 'react-toastify';

import { useGetRisksQuery, useDeleteRiskMutation, useCreateRiskMutation, useUpdateRiskMutation, useGetAllCategoriesQuery } from '../../api/generated/hooks';
import { useUser } from '../../contexts/UserContext';
import ConfirmDialog from '../ConfirmDialog';
import AddRiskForm from '../AddRiskForm';
import { Pagination, usePagination } from '../Pagination';
import { RiskRow } from '../RiskRow';
import { PAGE_SIZE } from '../../constants/constants.ts';

const Risks = () => {
	const { username } = useUser();
	const [deleteRiskId, setDeleteRiskId] = useState<string | null>(null);
	const [isAddFormOpen, setIsAddFormOpen] = useState(false);
	const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);
	const [showAllRisks, setShowAllRisks] = useState(false);
	const { cursor, currentPage, canGoPrevious, reset, handleNextPage, handlePreviousPage } = usePagination();
	const { loading, error, data, refetch, networkStatus } = useGetRisksQuery({
		variables: { createdBy: showAllRisks ? null : username || null, first: PAGE_SIZE, after: cursor },
		skip: !username,
		notifyOnNetworkStatusChange: true,
	});

	const { data: categoriesData } = useGetAllCategoriesQuery();

	const allRisks = useMemo(() => data?.risks?.edges?.map((edge) => edge.node) || [], [data?.risks?.edges]);
	const totalCount = data?.risks?.pageInfo?.totalCount || 0;
	const risks = useMemo(() => (showOnlyUnresolved ? allRisks.filter((risk) => !risk.resolved) : allRisks), [allRisks, showOnlyUnresolved]);
	const categories = categoriesData?.allCategories || [];
	const pageInfo = data?.risks?.pageInfo;

	const isInitialLoading = loading && !data;
	const isRefetching = networkStatus === NetworkStatus.refetch || networkStatus === NetworkStatus.setVariables;
	const showSkeleton = isInitialLoading || isRefetching;

	const [deleteRisk] = useDeleteRiskMutation({
		onCompleted: () => {
			setDeleteRiskId(null);
			toast.success('Risk deleted successfully');
			refetch();
		},
		onError: (error: { message: string }) => {
			toast.error('Error deleting risk: ' + error.message);
		},
	});

	const [createRisk] = useCreateRiskMutation({
		onCompleted: () => {
			setIsAddFormOpen(false);
			toast.success('Risk created successfully');
			reset(); // Reset to first page
			refetch();
		},
		onError: (error: { message: string }) => {
			toast.error('Error creating risk: ' + error.message);
		},
	});

	const [updateRisk] = useUpdateRiskMutation({
		onCompleted: () => {
			toast.success('Risk updated successfully');
			refetch();
		},
		onError: (error: { message: string }) => {
			toast.error('Error updating risk: ' + error.message);
		},
	});

	const handleDeleteClick = useCallback((riskId: string) => {
		setDeleteRiskId(riskId);
	}, []);

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

	const handleNameUpdate = useCallback(
		(riskId: string, newName: string) => {
			if (newName.trim()) {
				updateRisk({
					variables: {
						id: riskId,
						name: newName.trim(),
					},
				});
			}
		},
		[updateRisk]
	);

	const handleDescriptionUpdate = useCallback(
		(riskId: string, newDescription: string) => {
			updateRisk({
				variables: {
					id: riskId,
					description: newDescription.trim() || null,
				},
			});
		},
		[updateRisk]
	);

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">Error loading risks: {error.message}</p>
			</div>
		);
	}

	const onNextPage = () => {
		if (pageInfo) {
			handleNextPage({
				hasNextPage: pageInfo.hasNextPage,
				endCursor: pageInfo.endCursor ?? null,
			});
		}
	};

	const onPreviousPage = () => {
		handlePreviousPage();
	};

	const renderSkeletonRows = () =>
		Array.from({ length: PAGE_SIZE }).map((_, index) => (
			<tr key={`skeleton-${index}`} className="animate-pulse">
				<td className="px-6 py-4 whitespace-nowrap">
					<div className="h-4 bg-gray-200 rounded w-32" />
				</td>
				<td className="px-6 py-4 whitespace-nowrap">
					<div className="h-4 bg-gray-200 rounded w-64" />
				</td>
				<td className="px-3 py-4 whitespace-nowrap">
					<div className="h-4 bg-gray-200 rounded w-24" />
				</td>
				<td className="px-3 py-4 whitespace-nowrap">
					<div className="h-4 bg-gray-200 rounded w-20" />
				</td>
				<td className="px-6 py-4 whitespace-nowrap">
					<div className="h-4 bg-gray-200 rounded w-28" />
				</td>
				<td className="px-6 py-4 whitespace-nowrap">
					<div className="h-8 bg-gray-200 rounded w-16" />
				</td>
			</tr>
		));

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
						reset();
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
								reset();
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
							<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Category</th>
							<th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Status</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{showSkeleton ? (
							renderSkeletonRows()
						) : risks.length === 0 ? (
							<tr>
								<td colSpan={6} className="px-6 py-4 text-center text-gray-500">
									No risks available
								</td>
							</tr>
						) : (
							risks.map((risk) => (
								<RiskRow
									key={risk.id}
									risk={risk}
									onNameUpdate={handleNameUpdate}
									onDescriptionUpdate={handleDescriptionUpdate}
									onDeleteClick={handleDeleteClick}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
			<Pagination
				pageInfo={pageInfo}
				currentPage={currentPage}
				pageSize={PAGE_SIZE}
				totalCount={totalCount}
				itemCount={allRisks.length}
				entityName={{ singular: 'risk', plural: 'risks' }}
				onNext={onNextPage}
				onPrevious={onPreviousPage}
				canGoPrevious={canGoPrevious}
			/>
		</>
	);
};

export default Risks;
