import AuthCheck from '@/components/AuthCheck';
import PostFeed from '@/components/PostFeed';
import { UserContext } from '@/lib/context';
import { db, auth } from '@/lib/firebase';
import { serverTimestamp, collection, doc, query, orderBy, setDoc } from 'firebase/firestore';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

export default function AdminPostsPage({}) {


    return (

        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>

    )
}


function PostList() {

    
    // this error is meaningless as the function wont run if the user is not authenticated
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    const ref = collection(userDocRef, 'posts');

    const q = query(ref, orderBy('createdAt'));
    const [querySnapshot] = useCollection(q);

    const posts = querySnapshot?.docs.map((doc) => doc.data());


    return (
        <>
            <h1>Manage your posts</h1>
            <PostFeed posts={posts} admin />
        </>
    )

}

function CreateNewPost() {

    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));

    // validate title input
    const isValid = title.length > 3 && title.length < 100;


    // create and upload new post to db
    const createPost = async (e) => {
        e.preventDefault(); 
        const uid = auth.currentUser?.uid;
        if (!uid) {
            toast.error('User not authenticated');
            return;
        }
        const ref = doc(db, 'users', uid, 'posts', slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0
        }

        try{

            await setDoc(ref, data);
            toast.success('Post created!');

            // automatically navigate to the new post
            router.push(`/admin/${slug}`);
        }
        catch(err){
            console.error(err);
            toast.error('Error creating post');
        }


    }

    return (
        <form onSubmit={ createPost }>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New Article"
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid}>
                Create New Post
            </button>

        </form>
    )

}