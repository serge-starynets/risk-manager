import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CATEGORIES, DELETE_CATEGORY, CREATE_CATEGORY, GET_ALL_CATEGORIES } from '../../api/queries/categoryQueries';
import type { CategoriesConnection } from '../../api/types';
import { useUser } from '../../contexts/UserContext';
import ConfirmDialog from '../ConfirmDialog';
import AddCategoryForm from '../AddCategoryForm';
import { Pagination, usePagination } from '../Pagination';
import { toast } from 'react-toastify';

const PAGE_SIZE = 15;

const Categories = () => {
	const { username } = useUser();
	const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
	const [isAddFormOpen, setIsAddFormOpen] = useState(false);
	const [showAllCategories, setShowAllCategories] = useState(false);
	const { cursor, currentPage, canGoPrevious, reset, handleNextPage, handlePreviousPage } = usePagination();
	const { loading, error, data, refetch } = useQuery<{ categories: CategoriesConnection }>(GET_CATEGORIES, {
		variables: { createdBy: showAllCategories ? null : username || null, first: PAGE_SIZE, after: cursor },
		skip: !username,
	});

	const [deleteCategory] = useMutation(DELETE_CATEGORY, {
		refetchQueries: [{ query: GET_ALL_CATEGORIES }],
		onCompleted: () => {
			setDeleteCategoryId(null);
			toast.success('Category deleted successfully');
			refetch();
		},
		onError: (error) => {
			toast.error('Error deleting category: ' + error.message);
		},
	});

	const [createCategory] = useMutation(CREATE_CATEGORY, {
		refetchQueries: [{ query: GET_ALL_CATEGORIES }],
		onCompleted: () => {
			setIsAddFormOpen(false);
			toast.success('Category created successfully');
			reset(); // Reset to first page
			refetch();
		},
		onError: (error) => {
			toast.error('Error creating category: ' + error.message);
		},
	});

	const handleDeleteClick = (categoryId: string) => {
		setDeleteCategoryId(categoryId);
	};

	const handleConfirmDelete = () => {
		if (deleteCategoryId) {
			deleteCategory({ variables: { id: deleteCategoryId } });
		}
	};

	const handleCancelDelete = () => {
		setDeleteCategoryId(null);
	};

	const handleAddCategory = (formData: { name: string; description: string }) => {
		if (username) {
			createCategory({
				variables: {
					name: formData.name,
					description: formData.description || null,
					createdBy: username,
				},
			});
		}
	};

	if (loading) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">Loading categories...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500">Error loading categories: {error.message}</p>
			</div>
		);
	}

	const allCategories = data?.categories?.edges?.map((edge) => edge.node) || [];
	const totalCount = data?.categories?.pageInfo?.totalCount || 0;
	const categories = allCategories;
	const pageInfo = data?.categories?.pageInfo;

	const onNextPage = () => {
		if (pageInfo) {
			handleNextPage(pageInfo);
		}
	};

	const onPreviousPage = () => {
		handlePreviousPage();
	};

	return (
		<>
			<ConfirmDialog
				isOpen={deleteCategoryId !== null}
				title="Delete Confirmation"
				entity="Category"
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				confirmText="Confirm"
				cancelText="Cancel"
			/>
			<AddCategoryForm isOpen={isAddFormOpen} onClose={() => setIsAddFormOpen(false)} onSubmit={handleAddCategory} />
			<div className="mb-4 flex justify-start items-center gap-4">
				<button
					onClick={() => setIsAddFormOpen(true)}
					className="px-4 py-2 text-sm font-medium text-white bg-blue-600 cursor-pointer rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
				>
					Add Category
				</button>
				<button
					onClick={() => {
						setShowAllCategories(!showAllCategories);
						reset();
					}}
					className="px-4 py-2 text-sm font-medium text-white bg-green-600 cursor-pointer rounded-md hover:bg-green-700 
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
				>
					{showAllCategories ? "Show current user's categories" : 'Show all categories'}
				</button>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{categories.length === 0 ? (
							<tr>
								<td colSpan={4} className="px-6 py-4 text-center text-gray-500">
									No categories available
								</td>
							</tr>
						) : (
							categories.map((category) => (
								<tr key={category.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
									<td className="px-6 py-4 text-sm text-gray-500">{category.description || '-'}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.createdBy}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<button
											onClick={() => handleDeleteClick(category.id)}
											className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
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
			<Pagination
				pageInfo={pageInfo}
				currentPage={currentPage}
				pageSize={PAGE_SIZE}
				totalCount={totalCount}
				itemCount={allCategories.length}
				entityName={{ singular: 'category', plural: 'categories' }}
				onNext={onNextPage}
				onPrevious={onPreviousPage}
				canGoPrevious={canGoPrevious}
			/>
		</>
	);
};

export default Categories;
