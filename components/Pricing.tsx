'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SpaceBackground } from './SpaceBackground'

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['5 repositories', 'Basic analytics', 'Community support'],
  },
  {
    name: 'Hobby',
    price: '$1.99',
    features: ['Unlimited repositories', 'Advanced analytics', 'Priority support', 'Custom webhooks'],
  },
  {
    name: 'Pro',
    price: '$2.99',
    features: ['Unlimited repositories', 'Advanced analytics', 'Dedicated support', 'Custom integrations', 'On-premise option'],
  },
]

export default function Pricing() {
  return (
    <section className="py-16 max-md:px-6 relative mt-20 md:mt-32">
      <SpaceBackground />
      <div className="max-w-7xl absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-6xl font-bold text-center mb-16"
        >
          Choose Your Plan
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`bg-gradient-to-tr from-blue-900/30 via-indigo-900/20 to-purple-900/10 bg-opacity-50 p-12 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 flex flex-col ${plan.name === "Pro" ? "border-indigo-400" : ""}`}
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <div className="text-4xl md:text-5xl text-center font-bold my-8 bg-gradient-to-b from-indigo-300 to-white text-transparent bg-clip-text">
                {plan.price} /month
              </div>
              <div className='h-[1px] bg-gray-700 my-4' />
              <ul className="my-6 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center mb-3">
                    <Check className="h-7 w-7 text-indigo-300 mr-2" />
                    <span className='text-lg'>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.name === "Pro" ? (
                <button className='py-3 w-full bg-gradient-to-tr from-violet-700 via-indigo-700 to-purple-700 rounded-xl text-white md:text-lg font-semibold hover:bg-blue-600 duration-500'>
                  Choose {plan.name}
                </button>
              ) : (
                <button className='py-3 w-full bg-blue-700 rounded-xl text-white md:text-lg font-semibold hover:bg-blue-900 duration-300'>
                  Choose {plan.name}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section >
  )
}

