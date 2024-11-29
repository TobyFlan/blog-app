import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "@/components/PostContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import HeartButton from '@/components/HeartButton'
import AuthCheck from "@/components/AuthCheck";


export async function getStaticProps({ params }: { params: { username: string; slug: string} }) {
    
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



export default function PostsPage(props: { path: string; post: never; userPhotoUrl: string}) {
    const postRef = doc(db, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;
    const userPhoto = props.userPhotoUrl;


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
    

          </div>
        </main>
      )
}