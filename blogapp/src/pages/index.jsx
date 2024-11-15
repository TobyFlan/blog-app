import Head from 'next/head'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { collectionGroup, query, orderBy, limit, where, getDocs, startAfter, Timestamp } from 'firebase/firestore'
import { db, postToJSON } from '../lib/firebase'
import { useState } from 'react'
import PostFeed from '../components/PostFeed'

const LIMIT = 1;

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

  return (
    <>
      <Head>
        <title key="title">Home</title>
        <meta name="description" content="Explore the latest posts on our blog" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Latest Posts</h1>

        <div className="space-y-8">
          <PostFeed posts={posts} admin={false} />

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-[100px] w-full" />
            </div>
          )}

          <div className="flex justify-center">
            {!loading && !postsEnd && (
              <Button onClick={loadMorePosts} variant="outline" size="lg">
                Load more posts
              </Button>
            )}

            {postsEnd && (
              <p className="text-muted-foreground text-center">You&apos;ve reached the end!</p>
            )}
          </div>
        </div>
      </main>
    </>
  )
}