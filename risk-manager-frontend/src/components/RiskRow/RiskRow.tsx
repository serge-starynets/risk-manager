import { memo } from 'react';
import { EditableCell } from '../EditableCell';
import { RiskStatusToggle } from '../RiskStatusToggle';

export interface RiskRowProps {
	risk: {
		id: string;
		name: string;
		description?: string | null;
		category?: { name: string } | null;
		resolved: boolean;
		createdBy: string;
	};
	onNameUpdate: (riskId: string, newName: string) => void;
	onDescriptionUpdate: (riskId: string, newDescription: string) => void;
	onDeleteClick: (riskId: string) => void;
}

const RiskRow = memo(({ risk, onNameUpdate, onDescriptionUpdate, onDeleteClick }: RiskRowProps) => {
	return (
		<tr className="hover:bg-gray-50">
			<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				<EditableCell
					value={risk.name}
					onSave={(newValue) => onNameUpdate(risk.id, newValue)}
					className="min-w-[150px]"
					placeholder="Enter risk name"
				/>
			</td>
			<td className="px-6 py-4 text-sm text-gray-500">
				<EditableCell
					value={risk.description || ''}
					onSave={(newValue) => onDescriptionUpdate(risk.id, newValue)}
					className="min-w-[200px]"
					placeholder="Enter description"
				/>
			</td>
			<td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 w-32">{risk.category?.name || 'no category'}</td>
			<td className="px-3 py-4 whitespace-nowrap w-28">
				<RiskStatusToggle riskId={risk.id} resolved={risk.resolved} />
			</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{risk.createdBy}</td>
			<td className="px-6 py-4 whitespace-nowrap text-sm">
				<button
					onClick={() => onDeleteClick(risk.id)}
					className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 
					rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 
					focus:ring-offset-2 transition-colors cursor-pointer"
				>
					Delete
				</button>
			</td>
		</tr>
	);
});

RiskRow.displayName = 'RiskRow';

export default RiskRow;
