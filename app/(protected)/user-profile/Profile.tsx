
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/auth'
import { DollarSign, GitCommit, Github, Star } from 'lucide-react'

const Profile = async () => {
  const session = await auth()

  return (
    <>
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

      <span className='md:hidden text-gray-300 text-sm'>Acting Productive with Neovim, but I'm not</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
        <div className="bg-gradient-to-tr from-blue-900/30 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between">
            <GitCommit className="max-md:hidden h-8 w-8 text-indigo-400" />
            <div className="md:hidden text-gray-400 mt-2">Total Commits</div>
            <span className="text-2xl md:text-4xl text-gray-200">1,234</span>
          </div>
          <div className="max-md:hidden text-gray-400 mt-2">Total Commits</div>
        </div>
        <div className="bg-gradient-to-tr from-blue-900/30 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between">
            <Github className="max-md:hidden h-8 w-8 text-indigo-400" />
            <div className="md:hidden text-gray-400 mt-2">Total Repos</div>
            <span className="text-2xl md:text-4xl">42</span>
          </div>
          <div className="max-md:hidden text-gray-400 mt-2">Total Repos</div>
        </div>
        <div className="bg-gradient-to-tr from-blue-900/20 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between">
            <Star className="max-md:hidden h-8 w-8 text-indigo-400" />
            <div className="md:hidden text-gray-400 mt-2">Total Stars</div>
            <span className="text-2xl md:text-4xl text-gray-200">567</span>
          </div>
          <div className="max-md:hidden text-gray-400 mt-2">Total Stars</div>
        </div>
        <div className="bg-gradient-to-tr from-blue-900/20 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
          <div className="flex items-center justify-between">
            <DollarSign className="max-md:hidden h-8 w-8 text-indigo-400" />
            <div className="md:hidden text-gray-400 mt-2">Subscription</div>
            <span className="text-2xl md:text-4xl text-gray-200">Pro</span>
          </div>
          <div className="max-md:hidden text-gray-400 mt-2">Subscription</div>
        </div>
      </div>
    </>
  )
}

export default Profile
