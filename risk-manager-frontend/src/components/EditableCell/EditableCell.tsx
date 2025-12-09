import { useState, useRef, useEffect } from 'react';

interface EditableCellProps {
	value: string;
	onSave: (newValue: string) => void;
	className?: string;
	placeholder?: string;
}

const EditableCell = ({ value, onSave, className = '', placeholder = '' }: EditableCellProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	useEffect(() => {
		setEditValue(value);
	}, [value]);

	const handleClick = () => {
		setIsEditing(true);
	};

	const handleBlur = () => {
		if (editValue !== value) {
			onSave(editValue);
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.currentTarget.blur();
		} else if (e.key === 'Escape') {
			setEditValue(value);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<input
				ref={inputRef}
				type="text"
				value={editValue}
				onChange={(e) => setEditValue(e.target.value)}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				className={`w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
				placeholder={placeholder}
			/>
		);
	}

	return (
		<div onClick={handleClick} className={`cursor-pointer hover:bg-blue-50 rounded transition-colors min-h-[20px] ${className}`}>
			{value || <span className="text-gray-400 italic">{placeholder || 'Click to edit'}</span>}
		</div>
	);
};

export default EditableCell;
