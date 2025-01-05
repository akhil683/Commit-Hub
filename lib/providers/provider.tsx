import React, { ReactNode } from 'react'
import ReactQueryProvider from './ReactQueryProvider'
import { SessionProvider } from 'next-auth/react'

interface AppProviderProps {
  children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ReactQueryProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ReactQueryProvider>
  )
}

export default AppProvider
