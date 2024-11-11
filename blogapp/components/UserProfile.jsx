

export default function UserProfile({ user }) {
    return (
        <div>
            <p>Display Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
            <p>Photo URL: {user.photoURL}</p>
        </div>
    );
}