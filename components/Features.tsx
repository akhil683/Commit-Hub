'use client'

import { motion } from 'framer-motion'
import { Code, GitBranch, GitCommit } from 'lucide-react'
import { SpaceBackground } from './SpaceBackground'

export default function Features() {
  const features = [
    {
      icon: <Code className="h-16 w-16 text-violet-400" />,
      title: 'Automatic Tracking',
      description: 'Effortlessly track all your coding activity across repositories in one place',
    },
    {
      icon: <GitBranch className="h-16 w-16 text-pink-400" />,
      title: 'Branch Agnostic',
      description: 'Capture commits from all branches, not just main because main commits are considered in contribution graph',
    },
    {
      icon: <GitCommit className="h-16 w-16 text-cyan-400" />,
      title: 'Enhanced Profile',
      description: 'Showcase your activity on GitHub contribution graph including commits from non-main branches.',
    },
  ]

  return (
    <section className="py-16 px-6 relative">
      <SpaceBackground />
      <div className="max-w-7xl container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-center mb-16"
        >
          Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="flex flex-col justify-center items-center bg-gray-900 bg-opacity-30 p-6 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 py-16"
            >
              <div className="mb-8">{feature.icon}</div>
              <h3 className="text-2xl text-center md:text-3xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-300 max-w-72 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

