import { createContext, useState, useEffect } from 'react';
import {
	onAuthStateChangedListener,
	createUserDocumentFromAuth,
} from '../utils/firebase/firebase.utils';

// the actual value we want to access
export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser };

	// so basically this will run on mounting, unmounting and authState change
	useEffect(() => {
		// this unsubscribe and user is given to us from onAuthStateChanged

		// unsubscribe is basically to clean up the listener, we can also pass a complete callback in listener for clean up
		const unsubscribe = onAuthStateChangedListener((user) => {
			console.log(user);
			if (user) {
				createUserDocumentFromAuth(user);
			}
			setCurrentUser(user);
		});

		return unsubscribe;
	}, []);
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
