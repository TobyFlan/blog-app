import { useContext } from 'react';
import { UserContext } from '../lib/context';
import { getUserWithUsername } from '@/lib/firebase'


export default function CommentFeed({ comments }) {
  return (
    <div className="space-y-6 mt-8">
      {comments ? comments.map((comment) => <CommentItem comment={comment} key={comment.id}/>) : null}
    </div>
  )
}

function CommentItem({ comment }){

    const { username } = useContext(UserContext);

    const createdAt = comment.createdAt?.seconds
    ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString('en-UK')
    : 'Unknown date';
    
    if(username === comment.username){
        return (
            <div className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col h-full">
                    <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">@{comment.username} you own this comment!</span>
                    </div>
                    <div className="flex-grow">
                        <p className="text-muted-foreground line-clamp-3">{comment.content}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                        <span>{createdAt}</span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col h-full">
                <div className="space-y-1">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">@{comment.username}</span>
                </div>
                <div className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{comment.content}</p>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                    <span>{createdAt}</span>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

}