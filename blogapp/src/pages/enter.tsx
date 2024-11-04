import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../lib/firebase';
import { Button } from '@/components/ui/button';


export default function Enter({}) {
    const user = null;
    const username = null;


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

}