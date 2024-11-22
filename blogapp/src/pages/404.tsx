import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Custom404() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            404
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          >
            <Button asChild variant="default">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}