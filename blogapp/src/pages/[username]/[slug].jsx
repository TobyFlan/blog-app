import { getUserWithUsername, postToJSON, auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { collectionGroup, doc, getDoc, addDoc,  getDocs, collection, query, orderBy, updateDoc, increment } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "@/components/PostContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import HeartButton from '@/components/HeartButton'
import AuthCheck from "@/components/AuthCheck";
import CommentFeed from "@/components/CommentFeed";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/lib/context";


export async function getStaticProps({ params }) {
    
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;
    let userPhotoUrl;

    if (userDoc.exists()) {
        const postDocRef = doc(db, `users/${userDoc.id}/posts`, slug);
        post = postToJSON(await getDoc(postDocRef));
        const userData = userDoc.data();
        userPhotoUrl = userData ? userData.photoURL : null;

        path = postDocRef.path;
    }

    if(post?.updatedAt === 0) {
        return {
            notFound: true,
        }
    }

    return {
        props: { post, path, userPhotoUrl },
        revalidate: 5000,
    }

}

export async function getStaticPaths() {

    const snap = await getDocs(collectionGroup(db, 'posts'));

    const paths = snap.docs.map((doc) => {
        const { slug, username, userPhotoUrl } = doc.data();
        return {
            params: { username, slug, userPhotoUrl },
        }
    })

    return {
        paths,
        fallback: 'blocking',
    }
}



export default function PostsPage(props) {
    const postRef = doc(db, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;
    const userPhoto = props.userPhotoUrl;

    // fetch comments for the post
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    
    useEffect(() => {

      const fetchComments = async () => {

        const commentsColl = collection(postRef, 'comments');
        const commentsQuery = query(commentsColl, orderBy('createdAt', 'desc'));
        const commentsSnap = await getDocs(commentsQuery);
        const commentsData = commentsSnap.docs.map(doc => doc.data());

        setLoadingComments(false);
        setComments(commentsData);
      }

      fetchComments();

    }, [postRef]);



    

    return (
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-40 flex-shrink-0">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="text-center">Likes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-2xl font-bold flex items-center gap-2">
                        {post.heartCount || 0} <Heart className="h-6 w-6 text-red-500 fill-current" />
                      </p>

                      <AuthCheck
                        fallback={
                          <Link href="/enter">
                            <Button>
                              ❤️ Log in to like this post
                            </Button>
                          </Link>
                        }  
                      >
                        <HeartButton postRef={postRef} />
                      </AuthCheck>

                    </div>
                  </CardContent>
                </Card>
              </div>
            <section className="flex-grow max-w-3xl">
              <PostContent post={post} userPhoto={userPhoto} />
            </section>


            {/* Add comments form */}
            <section className="w-full md:w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Add a comment</CardTitle>
                </CardHeader>
                <CardContent>
                  <AuthCheck
                    fallback={
                      <Link href="/enter">
                        <Button>
                          Sign in to comment
                        </Button>
                      </Link>
                    }
                  >
                    <CommentForm postRef={postRef} />
                  </AuthCheck>
                </CardContent>
              </Card>
            </section>

            <section className="w-full md:w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentFeed comments={comments} />
                </CardContent>
              </Card>    
            </section>       

          </div>
        </main>
      )
}

function CommentForm({ postRef }) {

  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const { username } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const commentRef = collection(postRef, 'comments');

    await addDoc(commentRef, {
      content: commentText,
      createdAt: new Date(),
      username: username,
      uid: auth.currentUser.uid,
    })
    await updateDoc(postRef, {
      commentCount: increment(1),
    })

    setCommentText('');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input 
        type="text" 
        value={commentText} 
        onChange={(e) => setCommentText(e.target.value)} 
        placeholder="Comment..." 
        className="flex-grow p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" 
      />
      <Button disabled={loading} type="submit">Post</Button>
    </form>
  )

}