import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast'


import { collectionGroup, query, orderBy, limit, where, getDocs, startAfter, Timestamp } from 'firebase/firestore';
import { db, postToJSON } from '../../lib/firebase';
import { useState } from 'react';
import PostFeed from '../../components/PostFeed';

// max posts per page
const LIMIT = 1;

export async function getServerSideProps() {

  const q = query(
    collectionGroup(db, 'posts'),
    where('published', '==', true), 
    orderBy('createdAt', 'desc'), 
    limit(LIMIT)
  );

  //posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  const posts = (await getDocs(q)).docs.map(postToJSON);

  return {
    props: { posts }
  }

}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);


  const loadMorePosts = async () => {

    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const q = query(
      collectionGroup(db, 'posts'),
      where('published', '==', true), 
      orderBy('createdAt', 'desc'), 
      startAfter(cursor), 
      limit(LIMIT)
    );

    const newPosts = (await getDocs(q)).docs.map(doc => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }

  }


  return (
    <>
      <Head>
        <title key="title">Home</title>
      </Head>

      <main>
        <PostFeed posts={posts} admin={false} />


        {!loading && !postsEnd && <Button onClick={loadMorePosts}>Load more</Button>}

        <Loader show={loading} />

        {postsEnd && 'You have reached the end!'}

      </main>
     
      

    </>
  );
}
