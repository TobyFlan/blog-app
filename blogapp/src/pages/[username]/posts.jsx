

import AuthCheck from '@/components/AuthCheck';

import { UserContext } from '@/lib/context';
import { getUserWithUsername } from '@/lib/firebase';
import { useContext, useState } from 'react';

import { db, postToJSON, auth } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

import PostFeed from '@/components/PostFeed';

const LIMIT = 5;

export async function getServerSideProps(context) {

    const { username } = context.query;

    const userDoc = await getUserWithUsername(username);

    let posts = null;
    let user = null;

    if (userDoc) {
        user = userDoc.data();

        const postsRef = collection(userDoc.ref, 'posts');
        const postsQuery = query(
            postsRef,
            orderBy('createdAt', 'desc'),
            limit(LIMIT)
        )

        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }
    else {
        return {
            notFound: true
        }
    }

    return {
        props: {
            posts,
            user
        }
    }

}



export default function AdminPostList(props) {

    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    const loadMorePosts = async () => {
        setLoading(true);
        const last = posts[posts.length - 1];

        const q = query(
            collection(db, 'users', auth.currentUser.uid, 'posts'),
            orderBy('createdAt', 'desc'),
            startAfter(last.createdAt),
            limit(LIMIT)
        )

        const newPosts = (await getDocs(q)).docs.map(doc => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if(newPosts.length < LIMIT) {
            setPostsEnd(true);
        }
    }


    const { username } = useContext(UserContext);
    

    if(username !== props.user.username) {
        return <p>you are not allowed to view this page</p>
    }

    


    return (
        <AuthCheck>
            <p>Edit your posts!</p>
            <PostFeed posts={posts} admin={true} />

            {loading && (
                <p>Loading...</p>
            )}

            {!loading && !postsEnd && (
                <button onClick={loadMorePosts}>Load more</button>
            )}

            {postsEnd && (
                <p>You have reached the end!</p>
            )}
        </AuthCheck>
    )

}

