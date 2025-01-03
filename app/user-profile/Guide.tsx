import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios';
import { Github } from 'lucide-react'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'

interface SessionData {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  accessToken: string;
}
const Guide = () => {
  const [githubToken, setGithubToken] = useState('')
  const { data: session } = useSession()

  const createRepo = async () => {
    if (!session) return;
    try {
      const response = await axios.post("/api/create-repo", {
        accessToken: (session as SessionData).accessToken,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error creating repository:", error);
    }
  };

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement token submission logic
    console.log('Token submitted:', githubToken)
  }

  const handleCreateWebhook = async () => {
    if (!session) return;
    try {
      const response = await axios.post("/api/create-webhook", {
        accessToken: (session as SessionData).accessToken,
      })
      console.log("webhook response", response)
    } catch (error) {
      console.log("Error creating webhook", error)
    }
  }
  return (
    <div>
      <h2 className='text-2xl md:text-3xl font-semibold'>Step by Step guide to Automate Code Tracking</h2>
      <div className='h-[1px] bg-gray-700 my-8' />
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-2">1. Create Repository</h2>
        <p className="md:text-lg text-gray-300 mb-4">
          Create a private repository called code-tracking in your GitHub account. This repository will store mirrored commit messages from all your other repositories to ensure your contributions are logged on GitHub.
        </p>
        <Button onClick={createRepo} variant="outline" className="max-sm:w-full text-black">
          <Github className="mr-2 h-4 w-4" />
          Create Repo
        </Button>
      </div>
      <div className='h-[1px] bg-gray-700 my-8' />
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-2">2. Create Webhook</h2>
        <p className="md:text-lg text-gray-300 mb-4">
          Add webhooks to all your repositories. These webhooks will notify this app whenever you make a commit on any branch. The app will automatically mirror your commit messages to the code-tracking repository.
        </p>
        <Button onClick={handleCreateWebhook} variant="outline" className="max-sm:w-full text-black">
          <Github className="mr-2 h-4 w-4" />
          Create Webhook
        </Button>
      </div>
      <div className='h-[1px] bg-gray-700 my-8' />
      <div>
        <h2 className="text-2xl font-semibold mb-2">3. Connect Your GitHub Account</h2>
        <p className="md:text-lg text-gray-300 mb-4">
          Generate a personal access token on GitHub and connect your account to enable tracking.
        </p>
        <ol className="list-decimal list-inside space-y-3 mb-4 text-gray-300 md:text-lg">
          <li>Go to your GitHub Settings</li>
          <li>Click on "Developer settings" in the left sidebar</li>
          <li>Select "Personal access tokens" and then "Tokens (classic)"</li>
          <li>Click "Generate new token" and select "Generate new token (classic)"</li>
          <li>Give your token a descriptive name</li>
          <li>Give read and write access to following permissions:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Administration</li>
              <li>Commit Statuses</li>
              <li>Contents</li>
              <li>Metadata</li>
              <li>Webhooks</li>
              <li>Workflows</li>
            </ul>
          </li>
          <li>Click "Generate token" at the bottom of the page</li>
          <li>Copy your new token (make sure to save it, as you won't be able to see it again!)</li>
        </ol>

        <form onSubmit={handleSubmitToken} className="space-y-4">
          <div>
            <label htmlFor="github-token" className="block font-medium mb-2">
              GitHub Token
            </label>
            <Input
              id="github-token"
              type="password"
              placeholder="Paste your GitHub token here"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="bg-gray-800 border-gray-700 placeholder:text-gray-400 focus:border-gray-600 text-white"
            />
          </div>
          <Button type="submit" size={"lg"} className="w-full bg-indigo-600">
            Submit Token
          </Button>
        </form>
      </div>
    </div>
  )

}

export default Guide
