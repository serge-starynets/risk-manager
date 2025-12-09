interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	entity: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}

const ConfirmDialog = ({ isOpen, title, entity, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }: ConfirmDialogProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-opacity-10" onClick={onCancel}>
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
				<div className="p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
					<p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this {entity}?</p>
					<div className="flex justify-end gap-3">
						<button
							onClick={onCancel}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
						>
							{cancelText}
						</button>
						<button
							onClick={onConfirm}
							className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
