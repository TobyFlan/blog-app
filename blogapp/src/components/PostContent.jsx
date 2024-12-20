import Link from 'next/link';
import Markdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import MetaTags from './MetaTags';


export default function PostContent({ post, userPhoto }) {

    const createdAt = new Date(post?.createdAt?.seconds * 1000).toLocaleDateString('en-UK');

    return (
        <>
          <MetaTags
            title={post?.title}
            description={post?.content}
            image={userPhoto}
          />
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userPhoto} alt={post?.username} />
                  <AvatarFallback>{post?.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/${post?.username}`} className="font-medium hover:underline">
                    @{post?.username}
                  </Link>
                  <p className="text-sm text-muted-foreground">{createdAt}</p>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none" style={{overflowWrap: 'break-word', whiteSpace: 'pre-wrap'}}>
                <Markdown>{post?.content}</Markdown>
              </div>
            </CardContent>
          </Card>
        </>
      )


}