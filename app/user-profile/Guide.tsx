'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios';
import { ChevronRight, Github, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { SessionData } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

const Guide = () => {
  const [githubToken, setGithubToken] = useState('')
  const { data: session } = useSession()
  const { toast } = useToast()

  const createRepoMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        toast({
          title: "Un-Authorized !",
          description: "Please login you account.",
          variant: "destructive"
        })
        return
      };
      await axios.post("/api/create-repo", {
        accessToken: (session as SessionData).accessToken,
      });
    },
    onSuccess: () => {
      toast({
        title: "Created Successfully !",
        description: "'codetracking' private repository is created",
      })
    },
    onError: () => {
      toast({
        title: "Un-expected Error !",
        description: "Un-successfull, please try again ",
        variant: "destructive"
      })
    }
  })


  const createWebhookMutation = useMutation({
    mutationFn: async () => {
      if (!session) {
        toast({
          title: "Un-Authorized !",
          description: "Please login you account.",
          variant: "destructive"
        })
        return
      };
      await axios.post("/api/create-webhook", {
        accessToken: (session as SessionData).accessToken,
      });
    },
    onSuccess: () => {
      toast({
        title: "Created Successfully !",
        description: "Webhooks are created !",
      })
    },
    onError: () => {
      toast({
        title: "Un-expected Error !",
        description: "Un-successfull, please try again ",
        variant: "destructive"
      })
    }
  })

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement token submission logic
    console.log('Token submitted:', githubToken)
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
        <Button disabled={createRepoMutation.isPending} onClick={() => createRepoMutation.mutate()} variant="outline" className="max-sm:w-full text-black">
          {createRepoMutation.isPending
            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            : <Github className="mr-2 h-4 w-4" />
          }
          Create Repo
        </Button>
      </div>
      <div className='h-[1px] bg-gray-700 my-8' />
      <div>
        <h2 className="text-xl md:text-2xl font-semibold mb-2">2. Create Webhook</h2>
        <p className="md:text-lg text-gray-300 mb-4">
          Add webhooks to all your repositories. These webhooks will notify this app whenever you make a commit on any branch. The app will automatically mirror your commit messages to the code-tracking repository.
        </p>
        <Button disabled={createWebhookMutation.isPending} onClick={() => createWebhookMutation.mutate()} variant="outline" className="max-sm:w-full text-black">
          {createWebhookMutation.isPending
            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            : <Github className="mr-2 h-4 w-4" />
          }
          Create Webhook
        </Button>
      </div>
      <div className='h-[1px] bg-gray-700 my-8' />
      <div>
        <h2 className="text-2xl font-semibold mb-2">3. Connect Your GitHub Account</h2>
        <p className="md:text-lg text-gray-300">
          Generate a personal access token on GitHub and connect your account to enable tracking.
        </p>
        <Accordion type='single' collapsible className='w-full border p-4 rounded-lg border-gray-700 bg-gray-800/30 my-4'>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='text-lg flex gap-2 items-center font-semibold'>
              <ChevronRight className='w-6 h-6' />
              How to generate Personal Github Access Token ?
            </AccordionTrigger>
            <AccordionContent className='mt-4'>
              <ol className="list-decimal list-inside space-y-3 mb-4 text-gray-300">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
