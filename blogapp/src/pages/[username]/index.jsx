
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { getDocs, where, limit, orderBy, collection, query as firestoreQuery } from 'firebase/firestore';

export async function getServerSideProps({ query }) {


    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    let user = null;
    let posts = null;

    if (userDoc.exists()) {
        user = userDoc.data();
        
        const postsRef = collection(userDoc.ref, 'posts');
        const postsQuery = firestoreQuery( postsRef, where('published', '==', true), orderBy('createdAt', 'desc'), limit(5));

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
        
    }

    return {
        props: {
            user,
            posts
        }
    }


}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserProfilePage({ user, posts }) {
    return (
      <main className="container mx-auto px-4 py-8">
        <UserProfile user={user} />
        <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Latest Posts</h2>
        <PostFeed posts={posts} />
      </main>
    )
  }