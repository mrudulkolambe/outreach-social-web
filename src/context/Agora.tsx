import { registerAgoraUserService } from '@/service/agoraService';
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AgoraContextType {
	agoraUser: string | null;
	updateAgoraUser: (userID: string) => void;
	registerAgoraUser: (username: string) => void;
	loginAgoraUser: (username: string) => void;
}

const AgoraContext = createContext<AgoraContextType | undefined>(undefined);

interface AgoraProviderProps {
	children: ReactNode;
}

export const AgoraContextProvider: React.FC<AgoraProviderProps> = ({ children }) => {
	const [agoraUser, setAgoraUser] = useState<string | null>("");

	// Fetch conversations
	const registerAgoraUser = (username: string) => {
		// registerAgoraUserService(username);
	}
	const updateAgoraUser = (userID: string) => {
		setAgoraUser(userID)
	}

	const loginAgoraUser = (username: string) => {
		console.log("USERNAME", username)
		// registerAgoraUserService(username);
	}
	return (
		<AgoraContext.Provider value={{ agoraUser, updateAgoraUser, registerAgoraUser, loginAgoraUser }}>
			{children}
		</AgoraContext.Provider>
	);
};

export const useAgoraContext = (): AgoraContextType => {
	const context = useContext(AgoraContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
