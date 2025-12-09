import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';

const Login = () => {
	const [usernameInput, setUsernameInput] = useState('');
	const { setUsername } = useUser();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (usernameInput.trim()) {
			setUsername(usernameInput.trim());
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
			<h1 className="text-4xl font-bold text-gray-800 mb-8">WELCOME TO RISK MANAGER</h1>
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<div className="mb-6">
					<label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
						Username
					</label>
					<input
						type="text"
						id="username"
						value={usernameInput}
						onChange={(e) => setUsernameInput(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Enter your username"
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
				>
					Log In
				</button>
			</form>
		</div>
	);
};

export default Login;
