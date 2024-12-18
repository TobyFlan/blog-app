import { getUserWithUsername, postToJSON, auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { collectionGroup, doc, getDoc, addDoc, deleteDoc,  getDocs, collection, query, orderBy, updateDoc, increment } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "@/components/PostContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import HeartButton from '@/components/HeartButton'
import AuthCheck from "@/components/AuthCheck";
import CommentFeed from "@/components/CommentFeed";

import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/lib/context";
import toast from "react-hot-toast";


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

    const paths = snap.docs
      .map(doc => {
        const { slug, username } = doc.data();
        if (!slug || !username) {
          console.warn('Missing slug or username for doc:', doc.id);
          return null;
        }
        return { params: { username, slug } };
      })
      .filter(Boolean); // Filter out invalid entries

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
  
  useEffect(() => {

    const fetchComments = async () => {

      const commentsColl = collection(postRef, 'comments');
      const commentsQuery = query(commentsColl, orderBy('createdAt', 'desc'));
      const commentsSnap = await getDocs(commentsQuery);
      const commentsData = commentsSnap.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setComments(commentsData);
    }

    fetchComments();

  }, [postRef]);


  // function to handling the deletion of comments
  const deleteComment = async (commentId) => {
    const commentRef = doc(postRef, 'comments', commentId);
    // TODO: batch these for security
    await deleteDoc(commentRef);
    await updateDoc(postRef, {
      commentCount: increment(-1),
    })
    toast.success('Comment deleted!');
    setComments(comments.filter(comment => comment.id !== commentId));
  }



    

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-2 order-1 lg:order-1">
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
                      <Button className="w-full">
                        ❤️ Log in to like
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
        
        <section className="lg:col-span-6 order-2 lg:order-2">
          <PostContent post={post} userPhoto={userPhoto} />
        </section>

        <section className="lg:col-span-4 order-3">
          <div className="space-y-8 sticky top-8">
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
                  <CommentForm postRef={postRef} setComments={setComments} />
                </AuthCheck>
              </CardContent>
            </Card>

            <CommentFeed comments={comments} deleteComment={deleteComment}/>
          </div>
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

    // TODO: batch these for security
    await addDoc(commentRef, {
      content: commentText,
      createdAt: new Date(),
      username: username,
      uid: auth.currentUser.uid,
    })
    await updateDoc(postRef, {
      commentCount: increment(1),
    })

    toast.success('Comment posted!');

    setCommentText('');
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea 
        value={commentText} 
        onChange={(e) => setCommentText(e.target.value)} 
        placeholder="Write your comment..." 
        className="w-full"
      />
      <Button disabled={loading || !commentText.trim()} type="submit" className="w-full">
        Post Comment
      </Button>
    </form>
  )

}