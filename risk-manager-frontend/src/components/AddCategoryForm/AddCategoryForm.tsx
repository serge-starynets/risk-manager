import { useState, type FormEvent } from 'react';

interface AddCategoryFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { name: string; description: string }) => void;
}

const AddCategoryForm = ({ isOpen, onClose, onSubmit }: AddCategoryFormProps) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	if (!isOpen) return null;

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			return;
		}
		onSubmit({
			name: name.trim(),
			description: description.trim(),
		});
		setName('');
		setDescription('');
	};

	const handleCancel = () => {
		setName('');
		setDescription('');
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-10" onClick={handleCancel}>
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
				<div className="p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Add Category</h3>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
								Name <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>
						<div className="mb-6">
							<label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<input
								type="text"
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div className="flex justify-end gap-3">
							<button
								type="button"
								onClick={handleCancel}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
							>
								Add Category
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default AddCategoryForm;
