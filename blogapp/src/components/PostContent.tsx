import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"


export default function PostContent({ post }) {

    const createdAt = new Date(post?.createdAt?.seconds * 1000).toLocaleDateString('en-UK');

    // TODO, get user profile image 

    return (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://avatar.vercel.sh/${post?.username}`} alt={post?.username} />
                <AvatarFallback>{post?.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/${post?.username}`} className="font-medium hover:underline">
                  @{post?.username}
                </Link>
                <p className="text-sm text-muted-foreground">{createdAt}</p>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{post?.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )


}