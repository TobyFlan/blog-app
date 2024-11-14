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

function PostItem({ post }) {
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-md transition-shadow duration-200">
      <Link href={`/${post.username}/${post.slug}`} className="block">
        <CardHeader>
          <CardTitle className="text-xl font-semibold hover:text-primary transition-colors duration-200">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">{post.content}</p>
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