'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-900/60 via-indigo-800/60 to-purple-900/60">
      <div className="container mx-auto px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6"
        >
          Ready to Boost Your GitHub Profile?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl mb-8"
        >
          Start tracking all your coding activity and showcase your true contributions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button size="lg" className="bg-white text-indigo-900 hover:bg-gray-200">
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

