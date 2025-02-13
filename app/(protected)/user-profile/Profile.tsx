
import React, { ReactNode } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/auth'
import { GitCommit, Github, Star } from 'lucide-react'
import { getUserData } from '@/actions/getUserData'
import { UserType } from '@/types'

const Profile = async () => {

  const session = await auth()
  const res = await getUserData()
  const user = res as UserType | null
  console.log(user)

  return (
    <>
      <div className="flex max-md:flex-col gap-8 md:gap-16">
        <div className='flex md:flex-col gap-8 max-md:items-center'>
          <Avatar className="md:h-48 md:w-48 sm:h-44 sm:w-44 h-20 w-20">
            <AvatarImage
              src={session?.user?.image as string}
              alt="User"
            />
            <AvatarFallback>AP</AvatarFallback>
          </Avatar>
          <div className='md:mt-2 md:space-y-2'>
            <div className="text-2xl font-semibold md:text-3xl">
              {session?.user?.name}
            </div>
            <div className='max-sm:text-sm text-gray-400'>
              {session?.user?.name}
            </div>
          </div>
        </div>

        <span className='md:hidden text-gray-300 text-sm'>
          {user?.bio}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">

          <DataSection
            title="Total Commits"
            value={session?.user.total_commits || 0}
          >
            <GitCommit className="max-md:hidden h-8 w-8 text-indigo-400" />
          </DataSection>

          <DataSection
            title="Total Repos"
            value={(user?.public_repos! + user?.total_private_repos!) || 0}
          >
            <Github className="max-md:hidden h-8 w-8 text-indigo-400" />
          </DataSection>

          <DataSection
            title="Total Followers"
            value={user?.followers || 0}
          >
            <Star className="max-md:hidden h-8 w-8 text-indigo-400" />
          </DataSection>

          <DataSection
            title="Subscription"
            value={session?.user.subscription || "free"}
          >
            <Star className="max-md:hidden h-8 w-8 text-indigo-400" />
          </DataSection>
        </div>
      </div>
      <div className="my-8">
        <p className="max-md:hidden text-gray-300">
          {user?.bio}
        </p>
      </div>
      {!user && (
        <div className='md:p-4 p-3 max-md:text-xs rounded-lg border border-orange-500 bg-orange-700/20'>
          <p>
            Submit you Github Access Token to see profile stats
          </p>
        </div>
      )}
    </>
  )
}

export default Profile

export const DataSection = ({ children, value, title }: { children: ReactNode, title: string, value: string | number | null }) => {
  return (
    <div className="bg-gradient-to-tr from-blue-900/20 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700" >
      <div className="flex items-center justify-between">
        {children}
        <div className="md:hidden text-gray-400 mt-2">
          {title}
        </div>
        <span className="text-2xl md:text-4xl text-gray-200">
          {value}
        </span>
      </div>
      <div className="max-md:hidden text-gray-400 mt-2">
        {title}
      </div>
    </div >
  )
}
