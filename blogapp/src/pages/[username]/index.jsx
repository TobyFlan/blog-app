
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import MetaTags from '../../components/MetaTags';
import { getUserWithUsername, postToJSON } from '../../lib/firebase';
import { getDocs, where, limit, orderBy, collection, query as firestoreQuery } from 'firebase/firestore';
import { useContext } from 'react';
import { UserContext } from '../../lib/context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function getServerSideProps({ query }) {

    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    let user = null;
    let posts = null;
  
    if (userDoc) {
        user = userDoc.data();
        
        const postsRef = collection(userDoc.ref, 'posts');
        const postsQuery = firestoreQuery( 
          postsRef, 
          where('published', '==', true), 
          orderBy('createdAt', 'desc'), 
          limit(5)
        );

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
        
    }
    else{
        return {
            notFound: true
        }
    }

    return {
        props: {
            user,
            posts
        }
    }


}

export default function UserProfilePage({ user, posts }) {

  const { username } = useContext(UserContext);
  const ownAccount = username && username === user.username;

  return (
    <>
      <MetaTags title={user.username} description={user.username} />
      <main className="container mx-auto px-4 py-8">
        <UserProfile user={user} />

        {ownAccount && (
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/enter">
                Go to Sign Out
              </Link>
            </Button>
          </div>
        )}

        <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Latest Posts</h2>
        <PostFeed posts={posts} />
      </main>
    </>
  )
}