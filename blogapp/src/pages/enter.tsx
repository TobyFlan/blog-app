import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { auth, googleAuthProvider, db } from '../../lib/firebase';
import { Button } from '@/components/ui/button';
import { useContext, useState, useEffect, useCallback } from 'react';
import { UserContext } from '../../lib/context';
import debounce from 'lodash.debounce';

interface User {
    uid: string;
    photoURL: string;
    displayName: string;
    username: string;
}



export default function Enter({}) {
    const { user, username } = useContext(UserContext) as { user: User | null, username: string | null };

    console.log("user uname", user, username);


    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />

    return (

        <main>
            {user ? (
                !username ? <UsernameForm /> : <SignOutButton />
            ) : (
                <SignInButton />
            )}
        </main>

    )
}


// Sign in with Google button
function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            console.log('Signed in with Google');
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <Button onClick={signInWithGoogle}>
            Sign in with Google
        </Button>

    );


}

// Sign out button
function SignOutButton() {

    return (
        <Button onClick={() => {auth.signOut()}}>
            Sign out
        </Button>
    );

}

// Username form
function UsernameForm() {

    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext) as { user: User | null, username: string | null };


    useEffect(() => {
        checkUsername(formValue);
    }, [formValue])


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // create a ref
        if (!user) {
            console.error('User is null');
            return;
        }
        const userDoc = doc(db, 'users', user.uid);
        const usernameDoc = doc(db, 'username', formValue);


        const batch = writeBatch(db);
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();

    }


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase();
        const regex = /^[a-zA-Z0-9_]*$/;

        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (regex.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(
        debounce(async (username : string) => {
            if (username.length >= 3) {
                const ref = doc(db, 'username', username);
                const docSnap = await getDoc(ref);
                const exists = docSnap.exists();
                console.log('Firestore read executed');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500), 
        []
    );


    return (
        !username && (

            <section>
                <h3>create username</h3>
                <form onSubmit={onSubmit}>

                    <input name="username" placeholder="username" value={formValue} onChange={onChange}/>

                    <UsernameMessage username={formValue} isValid={isValid} loading={loading}/>

                    <Button type="submit" disabled={!isValid}>ENTER</Button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br/>
                        Loading: {loading.toString()}
                        <br/>
                        Username Valid: {isValid.toString()}
                    </div>

                </form>
            </section>

        )
    );

}

function UsernameMessage({ username, isValid, loading }: { username: string; isValid: boolean; loading: boolean }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}

