'use client'

import axios from 'axios'
import { motion } from 'framer-motion'
import { Github, GitFork, GitCommit } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface SessionData {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  accessToken: string;
}

export default function HowItWorks() {
  const steps = [
    {
      icon: <Github className="h-16 w-16 text-violet-400" />,
      title: 'Sign in with GitHub',
      description: 'Connect your GitHub account to get started.',
    },
    {
      icon: <GitFork className="h-16 w-16 text-pink-400" />,
      title: 'Create Tracking Repo',
      description: 'We create a new "code-tracking" repository in your account.',
    },
    {
      icon: <GitCommit className="h-16 w-16 text-cyan-400" />,
      title: 'Automatic Syncing',
      description: 'Your non-main branch commits are synced to the tracking repo.',
    },
  ]

  const { data: session } = useSession()

  // const createWebhookHandler = async () => {
  //   if (!session) return;
  //   try {
  //     const response = await axios.post("/api/create-webhook", {
  //       accessToken: (session as SessionData).accessToken,
  //     })
  //     console.log("webhook response", response)
  //   } catch (error) {
  //     console.log("Error creating webhook", error)
  //   }
  // }

  return (
    <section className="py-16 bg-black bg-opacity-30 mt-32">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-center mb-16"
        >
          How It Works
        </motion.h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-16 md:space-y-0 md:space-x-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col items-center text-center max-w-xs"
            >
              <div className="mb-6 p-4 bg-gray-800 bg-opacity-50 rounded-full backdrop-blur-sm">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-300 max-w-72">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

