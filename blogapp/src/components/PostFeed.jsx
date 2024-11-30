import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye } from 'lucide-react'

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


  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-md transition-shadow duration-200">
      {!admin ? (
        <Link href={`/${post.username}/${post.slug}`} className="block">
          <CardHeader className="space-y-1">
            <div className="text-sm text-muted-foreground">
              by{' '}
              <span className="font-medium hover:underline">
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
      ) : (
        <CardHeader className="space-y-1">
          <div className="text-sm text-muted-foreground">
            by{' '}
            <span className="font-medium hover:underline">
              @{post.username}
            </span>
          </div>
          <CardTitle className="text-xl font-semibold hover:text-primary transition-colors duration-200">
            {post.title}
          </CardTitle>
          {admin && (
            <div className="flex justify-between items-center">
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(post.updatedAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </CardHeader>
      )}
      {admin && (
        <>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/${post.slug}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${post.username}/${post.slug}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}