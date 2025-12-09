import { ApolloProvider } from '@apollo/client/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserProvider, useUser } from './contexts/UserContext';
import { apolloClient } from './api/apolloClient';
import Login from './components/Login';
import Main from './components/Main';

const AppContent = () => {
	const { username } = useUser();

	return username ? <Main /> : <Login />;
};

function App() {
	return (
		<ApolloProvider client={apolloClient}>
			<UserProvider>
				<AppContent />
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</UserProvider>
		</ApolloProvider>
	);
}

export default App;
