'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold bg-gradient-to-b from-indigo-300 to-primary text-transparent bg-clip-text"
        >
          Commit Hub
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button className="bg-primary hover:bg-indigo-700 text-white">
            <Github className="mr-2 h-4 w-4" /> Sign in with GitHub
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}

