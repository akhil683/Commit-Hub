'use client'
import React from 'react'
import { Button } from './ui/button'
import { Github, LogOut } from 'lucide-react'
import { signOut, signIn, useSession } from 'next-auth/react'

export const SignIn = () => {
  const { data: session } = useSession()

  return (
    <>
      {session
        ? (
          <Button onClick={() => signOut()} className="bg-primary hover:bg-indigo-700 text-white">
            Log out
            <LogOut className='md:mr-2 mr-1 h-4 w-4' />
          </Button >
        ) : (
          <Button onClick={() => signIn("github", { callbackUrl: '/user-profile' })} className="bg-primary hover:bg-indigo-700 text-white">
            <Github className="md:mr-2 mr-1 h-4 w-4" /> Sign In
            <span className='max-md:hidden'>with GitHub</span>
          </Button >
        )

      }
    </>
  )
}

