import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserWithUsername } from '@/lib/firebase'
import { useState, useEffect } from 'react'

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

  const [user, setUser] = useState()

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserWithUsername(post.username);
      setUser(userData.data());
    }
    fetchUser();
  }, [post.username]);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      {!admin ? (
        <Link href={`/${post.username}/${post.slug}`} className="flex flex-col h-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.photoURL} alt={post.username} />
                <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">@{post.username}</span>
            </div>
            <CardTitle className="text-xl font-semibold hover:text-primary transition-colors duration-200">
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground line-clamp-3">{post.content}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{minutesToRead} min read</span>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <p className="w-4 h-4" >❤️</p>
              <span>{post.heartCount || 0}</span>
            </Badge>
          </CardFooter>
        </Link>
      ) : (
        <>
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.userPhotoURL} alt={post.username} />
                  <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">@{post.username}</span>
              </div>
              <Badge variant={post.published ? "default" : "secondary"}>
                {post.published ? "Published" : "Draft"}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold hover:text-primary transition-colors duration-200">
              {post.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(post.updatedAt).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
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