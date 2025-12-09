import { useUser } from '../../contexts/UserContext';
import Risks from '../Risks';
import Categories from '../Categories';
import Tabs from '../Tabs';

const Main = () => {
	const { username, setUsername } = useUser();

	const handleLogout = () => {
		setUsername(null);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-800">RISK MANAGER</h1>
					{username && (
						<div className="flex items-center gap-4">
							<span className="text-gray-700 font-medium">
								Hello, <span className="font-bold">{username}</span>
							</span>
							<button
								onClick={handleLogout}
								className="px-4 py-2 text-sm font-medium text-white bg-red-600 cursor-pointer
								rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</header>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Tabs
					tabs={[
						{ label: 'Risks', content: <Risks /> },
						{ label: 'Categories', content: <Categories /> },
					]}
				/>
			</main>
		</div>
	);
};

export default Main;
