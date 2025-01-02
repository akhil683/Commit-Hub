'use client'

import { useState } from 'react'
import { SpaceBackground } from '@/components/SpaceBackground'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GitCommit, Github, Star, DollarSign } from 'lucide-react'

export default function UserProfile() {
  const [githubToken, setGithubToken] = useState('')

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement token submission logic
    console.log('Token submitted:', githubToken)
  }

  const handleCreateWebhook = () => {
    // TODO: Implement webhook creation logic
    console.log('Creating webhook...')
  }

  return (
    <div className="min-h-screen relative text-white">
      <SpaceBackground />
      <div className="container mx-auto px-8 py-24 relative z-10">
        <div>
          <div className="flex max-md:flex-col gap-8 md:gap-16">
            <div className='flex md:flex-col gap-8 max-md:items-center'>
              <Avatar className="md:h-56 md:w-56 sm:h-44 sm:w-44 h-20 w-20">
                <AvatarImage src="/" alt="User" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className='md:mt-4 md:space-y-2'>
                <div className="text-2xl font-semibold md:text-3xl">Akhil Palsra</div>
                <div className='max-sm:text-sm text-gray-400'>akhil683</div>
              </div>
            </div>
            <span className='md:hidden text-gray-300 text-sm'>Acting Productive with Neovim, but I'm not</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
              <div className="bg-gradient-to-tr from-blue-900/30 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <GitCommit className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl md:text-4xl text-gray-200">1,234</span>
                </div>
                <div className="text-gray-400 mt-2">Total Commits</div>
              </div>
              <div className="bg-gradient-to-tr from-blue-900/30 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <Github className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl md:text-4xl">42</span>
                </div>
                <div className="text-gray-400 mt-2">Total Repos</div>
              </div>
              <div className="bg-gradient-to-tr from-blue-900/20 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <Star className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl md:text-4xl text-gray-200">567</span>
                </div>
                <div className="text-gray-400 mt-2">Total Stars</div>
              </div>
              <div className="bg-gradient-to-tr from-blue-900/20 via-indigo-900/20 to-purple-900/20 bg-opacity-50 p-4 md:p-8 rounded-2xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-8 w-8 text-indigo-400" />
                  <span className="text-2xl md:text-4xl text-gray-200">Pro</span>
                </div>
                <div className="text-gray-400 mt-2">Subscription</div>
              </div>
            </div>
          </div>
        </div>
        <div className="my-8">
          <p className="max-md:hidden text-gray-300">Acting Productive with Neovim, but I'm not !</p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Connect Your GitHub Account</h2>
        <ol className="list-decimal list-inside space-y-4 mb-6">
          <li>Go to your GitHub Settings</li>
          <li>Click on "Developer settings" in the left sidebar</li>
          <li>Select "Personal access tokens" and then "Tokens (classic)"</li>
          <li>Click "Generate new token" and select "Generate new token (classic)"</li>
          <li>Give your token a descriptive name</li>
          <li>Select the following scopes:
            <ul className="list-disc list-inside ml-4">
              <li>repo (all)</li>
              <li>admin:repo_hook</li>
              <li>read:user</li>
            </ul>
          </li>
          <li>Click "Generate token" at the bottom of the page</li>
          <li>Copy your new token (make sure to save it, as you won't be able to see it again!)</li>
        </ol>

        <form onSubmit={handleSubmitToken} className="space-y-4">
          <div>
            <label htmlFor="github-token" className="block text-sm font-medium text-gray-300 mb-1">
              GitHub Token
            </label>
            <Input
              id="github-token"
              type="password"
              placeholder="Paste your GitHub token here"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button type="submit" className="w-full">
            Connect GitHub Account
          </Button>
        </form>

        <div className="mt-6">
          <Button onClick={handleCreateWebhook} variant="outline" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            Create GitHub Webhook
          </Button>
        </div>
      </div>
    </div>
  )
}

