import { useState } from 'react';
import { auth, storage } from '@/lib/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { toast } from 'react-hot-toast';

// after alot of debugging i found out that firebase storage
// is now a paid feature so i will have to find another way to
// upload images to the server

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const handleUpload = async (e) => {

        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        const sotrageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);

        setUploading(true);

        try {
            const uploadTask = uploadBytesResumable(sotrageRef, file);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            });

            await uploadTask;

            const downloadURL = await getDownloadURL(sotrageRef);
            setDownloadURL(downloadURL);
        }
        catch (error) {
            toast.error(error);
        }
        finally {
            setUploading(false);
        }
        
    }


    return(
        <div>
            
            <h1 show={uploading}>Uploading...</h1>
            {uploading && <progress value={progress} max="100" />}

            {!uploading && (
                <label>
                    Upload Image
                    <input type="file" onChange={handleUpload} accept="image/x-png,image/gif,image/jpeg"/>
                </label>
            )}

            {downloadURL && <code >{`![alt](${downloadURL})`}</code>}


        </div>
    );

}