import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUpdateRiskMutation } from '../../api/generated/hooks';

interface RiskStatusToggleProps {
	riskId: string;
	resolved: boolean;
}

const RiskStatusToggle = ({ riskId, resolved: initialResolved }: RiskStatusToggleProps) => {
	const [optimisticResolved, setOptimisticResolved] = useState(initialResolved);

	// Sync with prop changes (e.g., after parent refetch)
	useEffect(() => {
		setOptimisticResolved(initialResolved);
	}, [initialResolved]);

	const [updateRisk] = useUpdateRiskMutation({
		// Don't refetch queries - let Apollo's automatic cache update handle it
		refetchQueries: [],
		// Apollo will automatically update the cache with the returned data
		// This prevents unnecessary refetches that cause re-renders
		onCompleted: () => {
			toast.success('Risk status updated successfully');
		},
		onError: (error: { message: string }) => {
			// Revert optimistic update on error
			setOptimisticResolved(initialResolved);
			toast.error('Error updating risk status: ' + error.message);
		},
	});

	const handleStatusToggle = () => {
		const newStatus = !optimisticResolved;
		// Optimistic update
		setOptimisticResolved(newStatus);

		updateRisk({
			variables: {
				id: riskId,
				resolved: newStatus,
			},
		});
	};

	return (
		<span
			onClick={handleStatusToggle}
			className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors hover:opacity-80 ${
				optimisticResolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
			}`}
		>
			{optimisticResolved ? 'Resolved' : 'Unresolved'}
		</span>
	);
};

export default RiskStatusToggle;
