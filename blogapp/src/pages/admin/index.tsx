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

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function AdminPostsPage({}) {


    return (

        <main className="container mx-auto px-4 py-8">
            <AuthCheck>
            <Card className="mb-8">
                <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                <CreateNewPost />
                </CardContent>
            </Card>
            <PostList />
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
        <div>
            <h2 className="text-2xl font-bold mb-4">Manage your posts</h2>
            <PostFeed posts={posts} admin />
        </div>
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
        <form onSubmit={createPost} className="space-y-4">
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Article Title"
            className="w-full"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          <strong>Slug:</strong> {slug}
        </div>
        <Button type="submit" disabled={!isValid} className="w-full">
          Create New Post
        </Button>
      </form>
    )

}