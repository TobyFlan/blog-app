import AuthCheck from "@/components/AuthCheck"

import { useRouter } from "next/router"
import { useState } from "react"

import { useDocumentData } from "react-firebase-hooks/firestore"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import toast from "react-hot-toast"

import {db, auth} from "@/lib/firebase"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"




export default function AdminPostEdit({}) {


    return (

        <AuthCheck>
            <PostManager />
        </AuthCheck>

    )
}

function PostManager() {

    // check if user in preview mode or editing mode
    const [preview, setPreview] = useState(false);

    // get slug of post from URL
    const router = useRouter();
    const { slug } = router.query;

    // this error is pointless as the function wont run if the user is not authenticated
    const postRef = doc(db, 'users', auth.currentUser.uid, 'posts', slug);

    const [post] = useDocumentData(postRef);

    return(
        <main>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>
                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <h2>Tools</h2>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? 'Edit' : 'Preview'}
                        </button>
                        {/* <DeletePostButton postRef={postRef} /> */}
                    </aside>
                
                </>
            )}
        </main>
    );


}

function PostForm({ defaultValues, postRef, preview }) {

    const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

    const updatePost = async ({ content, published }) => {

        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post updated successfully');

    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>

            {/* if in preview mode */}
            {preview && (
                <div>
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            {/* if not in preview mode */}
            <div className={preview ? 'hidden' : 'controls'}>

                <textarea {...register('content')}></textarea>

                <fieldset>
                    <input type="checkbox" {...register('published')} ></input>
                    <label>Published</label>
                </fieldset>

                <button type="submit">
                    Save Changes
                </button>

            </div>

        </form>
    );
}