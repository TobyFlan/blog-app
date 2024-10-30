import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

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
export const firestore : Firestore = getFirestore(app);
export const storage : FirebaseStorage = getStorage(app);

