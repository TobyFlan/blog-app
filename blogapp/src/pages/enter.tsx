import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { Button } from '@/components/ui/button';
import { useContext } from 'react';
import { UserContext } from '../../lib/context';


export default function Enter({}) {
    const { user, username } = useContext(UserContext);

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

    return (
        <Button onClick={() => {auth.signOut()}}>
            Sign out
        </Button>
    );

}