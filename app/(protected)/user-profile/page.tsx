import { redirect } from 'next/navigation'
import { SpaceBackground } from '@/components/SpaceBackground'
import Guide from './Guide'
import { auth } from '@/auth'
import { Suspense } from 'react'
import Profile from './Profile'

export default async function UserProfile() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen relative text-white">
      <SpaceBackground />
      <div className="max-w-7xl container mx-auto px-8 py-24 relative z-10">
        <div className="flex max-md:flex-col gap-8 md:gap-16">
          <Suspense
            fallback={
              <div className='w-full h-64 rounded-2xl bg-gray-800/30 animate-pulse' />
            }
          >
            <Profile />
          </Suspense>
        </div>
        <div className="my-8">
          <p className="max-md:hidden text-gray-300">
            Acting Productive with Neovim, but I'm not !
          </p>
        </div>

        <div className='h-[1px] bg-gray-600 my-12 md:my-8' />
        {/* Step to automate commit tracking */}
        <Guide />
      </div>
    </div>
  )
}

