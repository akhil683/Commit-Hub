'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-900/40 via-indigo-800/60 to-purple-900/40">
      <div className="container mx-auto px-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6"
        >
          Want to contribute to this Project ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl mb-8"
        >
          Your contribution can help make this app even better. Join us in building something amazing together !
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-gray-200">
            <a href='https://github.com/akhil683/Commit-Hub'>
              Contribute Now
              <ArrowRight />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

