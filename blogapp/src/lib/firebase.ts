import { initializeApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore, collection, query, where, getDocs, limit } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCmSa6Mxr6J0FicARUBNFwR50NfIGbbENY",
    authDomain: "blog-app-b361d.firebaseapp.com",
    projectId: "blog-app-b361d",
    storageBucket: "blog-app-b361d.appspot.com",
    messagingSenderId: "934134467857",
    appId: "1:934134467857:web:31e5aa6da3ea42a85b10b0",
    measurementId: "G-1BLGN2DLG7"
};

const app = initializeApp(firebaseConfig);

export const auth : Auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const db : Firestore = getFirestore(app);

// helper functions

// get user document from firestore given username
export async function getUserWithUsername(username: string) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), limit(1));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0];
}

// convert firestore document to JSON
import { DocumentSnapshot } from 'firebase/firestore';

export function postToJSON(doc: DocumentSnapshot) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    };
}
