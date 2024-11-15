import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { collectionGroup, doc, getDoc, getDocs } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "@/components/PostContent";


export async function getStaticProps({ params }: { params: { username: string; slug: string } }) {
    
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc.exists()) {
        const postDocRef = doc(db, `users/${userDoc.id}/posts`, slug);
        post = postToJSON(await getDoc(postDocRef));

        path = postDocRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    }

}

export async function getStaticPaths() {

    const snap = await getDocs(collectionGroup(db, 'posts'));

    const paths = snap.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        }
    })

    return {
        paths,
        fallback: 'blocking',
    }
}



export default function PostsPage(props: { path: string; post: unknown; }) {
    const postRef = doc(db, props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;

    return (

        <main>

        <section>
          <PostContent post={post} />
        </section>
  
        <aside className="card">
          <p>
            <strong>{post.heartCount || 0} 🤍</strong>
          </p>
  
        </aside>
      </main>

    )
}