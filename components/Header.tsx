'use client'

import { motion } from 'framer-motion'
import { SignIn } from './sign-in'
import Link from 'next/link'
import { Kanban, LayoutDashboard } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={"/"}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-b from-indigo-300 to-primary text-transparent bg-clip-text"
          >
            Commit Hub
          </motion.div>
        </Link>
        <div className='flex justify-center items-center gap-4'>
          {session && (
            <>
              <Link href={"/user-profile"} className=' text-white text-sm'>
                <LayoutDashboard className='w-4 h-4' />
                <p className='max-md:hidden'>
                  Dashboard
                </p>
              </Link>
              <Link href={"/leaderboard"} className=' text-white text-sm'>
                <Kanban className='rotate-180 w-4 h-4' />
                <p className='max-md:hidden'>
                  Leaderboard
                </p>
              </Link>
            </>
          )}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SignIn />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

