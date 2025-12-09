import { createContext, useContext, useState, type ReactNode } from 'react';

interface UserContextType {
	username: string | null;
	setUsername: (username: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [username, setUsername] = useState<string | null>(null);

	return <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
