import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PostFeed({ posts, admin }) {
  return (
    <div className="space-y-6 mt-8">
      {posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null}
    </div>
  )
}

function PostItem({ post, admin }) {
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  const path  = admin ? `/admin/${post.slug}` : `/${post.username}/${post.slug}`

  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-md transition-shadow duration-200">
      <Link href={path} className="block">
        <CardHeader className="space-y-1">
          <div className="text-sm text-muted-foreground">
            by{' '}
            <span href={`/${post.username}`} className="font-medium hover:underline">
              @{post.username}
            </span>
          </div>
          <CardTitle className="text-xl font-semibold hover:text-primary transition-colors duration-200">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{wordCount} words · {minutesToRead} min read</span>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <span>❤️</span>
            <span>{post.heartCount || 0}</span>
          </Badge>
        </CardFooter>
      </Link>
    </Card>
  )
}