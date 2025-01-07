'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Github, LogOut, Loader2 } from 'lucide-react'
import { signOut, signIn, useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

export const SignIn = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn("github", { callbackUrl: '/(protected)/user-profile' })
      toast({
        title: "Login Success !",
        description: "You are logged in successfully"
      })
    } catch (SignInError) {
      console.log("Error during signin: ", SignInError)
      // toast({
      //   title: "Error !",
      //   description: "Failed to signin."
      // })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logout Success !",
        description: "You are logged out successfully"
      })
    } catch (SignOutError) {
      console.log("Error during signout: ", SignOutError)
    }
  }


  return (
    <>
      {session
        ? (
          <Button onClick={handleSignOut} className="bg-primary hover:bg-indigo-700 text-white">
            Log out
            <LogOut className='md:mr-2 mr-1 h-4 w-4' />
          </Button >
        ) : (
          <Button disabled={loading} onClick={handleSignIn} className="bg-primary hover:bg-indigo-700 text-white">
            {loading
              ? <Loader2 className='md:mr-2 mr-1 h-4 w-4 animate-spin' />
              : <Github className="md:mr-2 mr-1 h-4 w-4" />
            }
            Login
            <span className='max-md:hidden'>via GitHub</span>
          </Button >
        )

      }
    </>
  )
}

