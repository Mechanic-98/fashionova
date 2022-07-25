import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyAMdcB38N76a53yc4ZuCuGwBqQPTjfva-o',
	authDomain: 'fashionova-717b5.firebaseapp.com',
	projectId: 'fashionova-717b5',
	storageBucket: 'fashionova-717b5.appspot.com',
	messagingSenderId: '958433104848',
	appId: '1:958433104848:web:41f276349633f2b88f9fd5',
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider(); // GoogleAuthProvider is a class
// we have other class as well like, facebookAuthProvider, githubAuthProvider etc

googleProvider.setCustomParameters({
	prompt: 'select_account',
});

// auth is a singleton which keeps track of authentication of the entire app as user sign in
export const auth = getAuth();

export const signInWithGooglePopup = () =>
	signInWithPopup(auth, googleProvider);

// this singleton object directs points to our db in console
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
	if (!userAuth) return;
	const userDocRef = doc(db, 'users', userAuth.uid); // doc methods allow us to retreive doc from a collection in db
	// it receives (db, collection name, unique id of document)
	// -> since we are storing users thus we are using user's uid as a uinique id to for doc

	const userSnapshot = await getDoc(userDocRef); // getDoc allow us to get data from document

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			// setDoc allow us to set data in document
			// it takes document reference and the data we want to set
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInfo,
			});
		} catch (error) {
			console.log('error creating the user', error.message);
		}
	}

	return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
};
