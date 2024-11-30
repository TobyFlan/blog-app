import AuthCheck from "@/components/AuthCheck"

import { useRouter } from "next/router"
import { useState } from "react"

import { useDocumentData } from "react-firebase-hooks/firestore"
import { useForm, Controller } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import toast from "react-hot-toast"

import { db, auth } from "@/lib/firebase"
import { doc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Custom404 from "../404"



export default function AdminPostEdit({}) {


    return (

        <AuthCheck>
            <PostManager />
        </AuthCheck>

    )
}

function PostManager() {

  
  // states for deletion handling
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState('');

  // check if user in preview mode or editing mode
  const [preview, setPreview] = useState(false);

  // get slug of post from URL
  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(db, 'users', auth.currentUser.uid, 'posts', slug);

  const [post] = useDocumentData(postRef);

  if (!post) {
      return <><Custom404/></>;
  }

  const handleDelete = async () => {

    if (deleteSlug === post.slug){
      try{
        await deleteDoc(postRef);
        router.push('/admin');
        toast.success('Post deleted successfully');
      } catch (error){
        toast.error('Error deleting post: ', error.message);
      }
    }
    else{
      toast.error('Slug does not match. Please try again.');
    }
  };

  return(
      <main className="container mx-auto px-4 py-8">
      {post && (
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground">ID: {post.slug}</p>
            </CardHeader>
            <CardContent>
              <PostForm postRef={postRef} defaultValues={post} preview={preview} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setPreview(!preview)} variant="outline" className="w-full">
                {preview ? 'Edit' : 'Preview'}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${post.username}/${post.slug}`}>
                  Live View
                </Link>
              </Button>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-background border-border">
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Please type the post slug to confirm.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    placeholder={post.slug}
                    value={deleteSlug}
                    onChange={(e) => setDeleteSlug(e.target.value)}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteSlug !== post.slug}
                    >
                      Delete Post
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );


}

function PostForm({ defaultValues, postRef, preview }) {

    const { register, handleSubmit, reset, watch, control, formState } = useForm({ defaultValues, mode: 'onChange' });

    const { isValid, isDirty, errors } = formState;

    const updatePost = async ({ content, published }) => {

        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post updated successfully');

    };

    return (
        <form onSubmit={handleSubmit(updatePost)} className="space-y-4">
            {preview && (
            <Card>
                <CardContent className="prose dark:prose-invert max-w-none mt-4">
                <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </CardContent>
            </Card>
            )}
    
            <div className={preview ? 'hidden' : ''}>

                <Textarea
                    {...register('content', {
                        maxLength: { value: 20000, message: 'Content is too long' },
                        required: { value: true, message: 'Content is required' },
                        minLength: { value: 5, message: 'Content is too short' },
                    })}
                    rows={15}
                    placeholder="Write your post content here..."
                    className="w-full"
                />

                {errors.content && (
                    <p className="text-sm text-red-500">{errors.content.message}</p>
                )}
                    
                <div className="flex items-center space-x-2 mt-4">
                    <Controller
                        name="published"
                        control={control}
                        render={({ field }) => (
                        <Checkbox
                            id="published"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        )}
                    />
                    <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Publish this post
                    </Label>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                    {watch('published') ? 'This post is public and visible to all users.' : 'This post is currently a draft and only visible to you.'}
                </div>
  
                <Button type="submit" className="mt-4" disabled={!isDirty || !isValid}>
                    Save Changes
                </Button>
            </div>
      </form>
    );
}