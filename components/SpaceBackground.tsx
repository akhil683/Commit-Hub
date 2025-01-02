'use client'

import React from 'react'
import { motion } from 'framer-motion'

const Star = ({ size, top, left, delay }: { size: number; top: string; left: string; delay: number }) => (
  <motion.div
    className="absolute rounded-full bg-blue-50"
    style={{
      width: size,
      height: size,
      top,
      left,
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay,
    }}
  />
)

export const SpaceBackground = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary to-black opacity-20" />
      {stars.map((star, index) => (
        <Star key={index} {...star} />
      ))}
      <motion.div
        className="absolute inset-0 bg-repeat opacity-5"
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

