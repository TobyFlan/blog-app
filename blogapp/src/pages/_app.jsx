import "@/styles/globals.css";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../../lib/context";

import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function App({ Component, pageProps }) {

  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (user) {

      const ref = doc(db, 'user', user.uid);

      unsubscribe = onSnapshot(ref, (doc) => {

        
        setUsername(doc.data()?.username);
      });
      

    } else {
      setUsername(null);
    }
    return unsubscribe;
  }, [user]);

  console.log('user', user);
  


  return (
    <UserContext.Provider value={{ user, username }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
