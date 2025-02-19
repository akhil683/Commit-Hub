'use client'

import { motion } from 'framer-motion'
import { SpaceBackground } from './SpaceBackground'
import { signIn, useSession } from 'next-auth/react'
import { Button } from './ui/button'
import Link from 'next/link'

export default function Hero() {
  const { data: session } = useSession()


  return (
    <section className="relative h-screen flex items-center">
      <SpaceBackground />
      <div className="container mx-auto px-4 relative z-10">
        {/* <div className='text-center mb-4 mx-auto'> */}
        {/*   <p className='bg-gradient-to-b from-indigo-500 to-indigo-950 inline-block px-4 py-2 text-xs md:text-sm rounded-full'> */}
        {/*     Coming Soon */}
        {/*   </p> */}
        {/* </div> */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl md:text-7xl font-bold text-center mb-6"
        >
          Track Your Code, {" "}
          <span className="bg-gradient-to-b from-indigo-300 to-primary text-transparent bg-clip-text">
            Amplify Your Profile
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-lg md:text-xl text-center text-gray-300 mb-8"
        >
          Automatically sync your non-main branch commits to light up your GitHub contribution graph.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex justify-center"
        >
          {/* <WaitListForm /> */}
          {session ? (

            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link href={"/user-profile"}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button onClick={() => signIn("github", { callbackUrl: '/user-profile' })} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Get Started
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  )
}

