import { useState, type ReactNode } from 'react';

interface Tab {
	label: string;
	content: ReactNode;
}

interface TabsProps {
	tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<div className="bg-white rounded-lg shadow-md">
			<div className="border-b border-gray-200">
				<nav className="flex -mb-px" aria-label="Tabs">
					{tabs.map((tab, index) => (
						<button
							key={index}
							onClick={() => setActiveTab(index)}
							className={`
								px-6 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer
								${activeTab === index ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
							`}
						>
							{tab.label}
						</button>
					))}
				</nav>
			</div>
			<div className="p-6">{tabs[activeTab].content}</div>
		</div>
	);
};

export default Tabs;
