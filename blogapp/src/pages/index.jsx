import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { collectionGroup, query, orderBy, limit, where, getDocs, startAfter, Timestamp } from 'firebase/firestore'
import { db, postToJSON } from '../lib/firebase'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../lib/context'
import PostFeed from '../components/PostFeed'
import MetaTags from '../components/MetaTags'
import { BookOpen } from 'lucide-react'

const LIMIT = 5;

export async function getServerSideProps() {
  const q = query(
    collectionGroup(db, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  )

  const posts = (await getDocs(q)).docs.map(postToJSON)

  return {
    props: { posts }
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)
  const [greeting, setGreeting] = useState('Welcome');

  const { username } = useContext(UserContext);


  const loadMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt

    const q = query(
      collectionGroup(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    )

    const newPosts = (await getDocs(q)).docs.map(doc => doc.data())

    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  
  useEffect(() => {
    if (username) {
      const time = new Date().getHours();
      if (time < 12) {
        setGreeting(`Good morning, ${username}!`)
      } else if (time < 18) {
        setGreeting(`Good afternoon, ${username}!`)
      } else {
        setGreeting(`Good evening, ${username}!`)
      }
    }
  }, [username])
  

  return (
    <>
      <MetaTags title={"Home"} description={"Get the latest posts on our site"} />

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <BookOpen className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">{greeting}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take a look around!
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-8">Latest Posts</h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            <PostFeed posts={posts} admin={false} />

            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            )}

            <div className="flex justify-center mt-8">
              {!loading && !postsEnd && (
                <Button onClick={loadMorePosts} variant="outline" size="lg" className="px-8">
                  Load more posts
                </Button>
              )}

              {postsEnd && (
                <p className="text-muted-foreground text-center text-lg">You&apos;ve reached the end!</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}