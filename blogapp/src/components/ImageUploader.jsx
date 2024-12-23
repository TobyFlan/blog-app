import { useState } from 'react';
import { auth, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { toast } from 'react-hot-toast';

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from 'lucide-react'

// after alot of debugging i found out that firebase storage
// is now a paid feature so i will have to find another way to
// upload images to the server

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const handleUpload = async (e) => {

        const file = Array.from(e.target.files)[0];
        if (!file) {
            toast.error('No file selected.');
            return;
        }
        const extension = file.type.split('/')[1];

        const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);

        setUploading(true);
        setDownloadURL(null);
        setProgress(0);

        try {
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);  
                    setProgress(progress);
                },
                (error) => {
                    setUploading(false);
                    toast.error(error.message);
                },
                async () => {
                    const downloadURL = await getDownloadURL(storageRef);
                    setDownloadURL(downloadURL);
                    setUploading(false);
                    toast.success('Image uploaded successfully!');
                }
            );
        }
        catch (error) {
            toast.error(error);
            setUploading(false);
        }
       
    }


    return (
        <Card className="w-full mb-4">
            <CardContent className="pt-6">
                {uploading ? (
                    <div className="space-y-2">
                        <Label>Uploading...</Label>
                        <Progress value={progress} className="w-full" />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200">
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <span className="mt-2 block text-sm font-medium text-gray-700">
                                        Upload Image
                                    </span>
                                </div>
                            </div>
                            <Input id="image-upload" type="file" onChange={handleUpload} accept="image/x-png,image/gif,image/jpeg,image/jpg" className="hidden" />
                        </Label>
                    </div>
                )}
                {downloadURL && (
                    <div className="mt-4">
                        <Label>Image URL:</Label>
                        <div className="flex mt-1">
                            <Input value={`![alt](${downloadURL})`} readOnly className="flex-grow" />
                            <Button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(`![alt](${downloadURL})`);
                                    toast.success('URL copied to clipboard!');
                                }}
                                className="ml-2"
                            >
                                Copy
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

}