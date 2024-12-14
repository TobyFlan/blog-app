import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getUserWithUsername } from '@/lib/firebase';
import { useState, useEffect } from 'react';

import Markdown from 'react-markdown';

export default function CommentFeed({ comments, deleteComment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} deleteComment={deleteComment} />
            ))
          ) : (
            <p className="text-muted-foreground">No comments yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CommentItem({ comment, deleteComment }) {
  const [userPhotoURL, setUserPhotoURL] = useState(null);
  const { username } = useContext(UserContext);

  const createdAt = comment.createdAt?.seconds
    ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString('en-UK')
    : 'Unknown date';

  const canDelete = comment.username === username;

  useEffect(() => {
    async function fetchUserPhoto() {
      const userDoc = await getUserWithUsername(comment.username);
      if (userDoc?.exists()) {
        setUserPhotoURL(userDoc.data()?.photoURL);
      }
    }
    fetchUserPhoto();
  }, [comment.username]);


  
  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={userPhotoURL} />
          <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">@{comment.username}</span>
            <span className="text-xs text-muted-foreground">{createdAt}</span>
          </div>
          <div className="prose dark:prose-invert max-w-none text-sm mt-1" style={{overflowWrap: 'anywhere', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
            <Markdown>{comment.content}</Markdown>
          </div>
        </div>
      </div>
      {canDelete && (
        <div className="flex justify-end">
          <Button
            onClick={() => deleteComment(comment.id)}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      )}
      <Separator className="mt-2" />
    </div>
  );
}