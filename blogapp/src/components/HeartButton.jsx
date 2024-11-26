import { db, auth } from '@/lib/firebase';
import { increment, writeBatch, doc, collection } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function HeartButton({ postRef }) {

    const heartColl = collection(postRef, 'hearts');
    const heartRef = doc(heartColl, auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);


    const addHeart = async () => {

        const uid = auth.currentUser.uid;
        const batch = writeBatch(db);

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
    };

    const removeHeart = async () => {

        const batch = writeBatch(db);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    };
 
    return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={heartDoc?.exists() ? removeHeart : addHeart}
            variant={heartDoc?.exists() ? "destructive" : "default"}
            size="sm"
            className="rounded-full"
          >
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {heartDoc?.exists() ? '💔' : '❤️'}
            </motion.span>
            <span className="ml-2">
              {heartDoc?.exists() ? 'Unheart' : 'Heart'}
            </span>
          </Button>
        </motion.div>
      )

}