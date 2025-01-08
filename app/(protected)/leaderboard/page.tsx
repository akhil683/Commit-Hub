'use client'

import { motion } from 'framer-motion'
import { SpaceBackground } from '@/components/SpaceBackground'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Image from 'next/image'

const leaderboardData = [
  { id: 1, name: 'Alice Johnson', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 1234 },
  { id: 2, name: 'Bob Smith', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 987 },
  { id: 3, name: 'Charlie Brown', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 876 },
  { id: 4, name: 'Diana Prince', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 765 },
  { id: 5, name: 'Ethan Hunt', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 654 },
  { id: 6, name: 'Fiona Gallagher', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 543 },
  { id: 7, name: 'George Costanza', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 432 },
  { id: 8, name: 'Hermione Granger', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 321 },
  { id: 9, name: 'Ian Malcolm', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 210 },
  { id: 10, name: 'Julia Child', image_url: "https://avatars.githubusercontent.com/u/71344171?s=48&v=4", commits: 109 },
]

export default function Leaderboard() {
  return (
    <div className="min-h-screen relative mt-16">
      <SpaceBackground />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h2 className='bg-gradient-to-b from-indigo-300 to-primary text-transparent bg-clip-text text-2xl font-semibold sm:text-3xl md:text-5xl text-center mb-4'>
          Leaderboard
        </h2>
        <Table className='md:text-xl'>
          <TableHeader>
            <TableRow className='hover:bg-gray-700/20'>
              <TableHead className="md:w-[100px]">Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Total Commits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-gray-300'>
            {leaderboardData?.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='hover:bg-gray-700/20 duration-200'
              >
                <TableCell className="font-medium text-2xl md:text-3xl">{index + 1}</TableCell>
                <TableCell className='flex gap-2 items-center'>
                  <Image
                    src={user.image_url}
                    alt={user.name}
                    width={30}
                    height={30}
                    className='rounded-full'
                  />
                  {user.name}
                </TableCell>
                <TableCell className="text-right">
                  <span className='text-right font-semibold bg-gray-700/60 px-4 py-2 rounded-xl'>
                    {user.commits.toLocaleString()}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

