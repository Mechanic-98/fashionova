import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	collection,
	writeBatch,
	query,
	getDocs,
} from 'firebase/firestore';

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

export const addCollectionAndDocuments = async (
	collectionKey,
	objectsToAdd
) => {
	const collectionRef = collection(db, collectionKey);

	// we need a batch to store all unit of works (write, deleted, sets etc) to make a successfull transaction on collectionRef
	// Only when we're ready to fire off a btach, an actual transaction begin
	const batch = writeBatch(db);

	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object.title.toLowerCase());
		batch.set(docRef, object);
	});

	await batch.commit();
	console.log('done');
};

export const getCategoriesAndDocuments = async () => {
	const collectionRef = collection(db, 'categories');

	const q = query(collectionRef);

	// Note: getDocs is different from getDoc
	const querySnapshot = await getDocs(q); // getDocs fetch documents (hats, jackets, sneakers etc)

	const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
		// querySnapshot.docs => array of documents
		const { title, items } = docSnapshot.data();
		acc[title.toLowerCase()] = items;
		return acc;
	}, {});

	return categoryMap;
};

export const createUserDocumentFromAuth = async (userAuth, additionalInfo) => {
	if (!userAuth) return;

	// Whenever we try to find something in db, firebase creates one reference for us even if its not populated
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

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
	await signOut(auth);
};

// a permanent listener
// it returns you back whatever you get from an auth state change
// everytime the auth state changes it executes the callback function
export const onAuthStateChangedListener = (callback) => {
	onAuthStateChanged(auth, callback);
	/**
	 * {
	 * next: callback,
	 * error: errorCallback,
	 * complete: completeCallback
	 * }
	 *
	 * we cn have error and complete as well
	 */
};
