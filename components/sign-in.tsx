import React from 'react'
import { signIn } from '@/auth'

export const SignIn = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button type='submit'>Signin with Github</button>
    </form>
  )
}

