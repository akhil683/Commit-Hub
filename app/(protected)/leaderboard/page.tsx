import Image from 'next/image'
import { SpaceBackground } from '@/components/SpaceBackground'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { db } from '@/lib/db/db'
import { usersTable } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { auth } from '@/auth'


export default async function Leaderboard() {

  const session = await auth()

  const leaderboardData = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.total_commits))
    .limit(10)

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
            <tr
              className='bg-indigo-700/40 duration-200 rounded-3xl'
            >
              <TableCell className="font-medium text-2xl md:text-3xl">0</TableCell>
              <TableCell className='flex gap-2 items-center'>
                <Image
                  src={session?.user.image as string}
                  alt={session?.user.name as string}
                  width={30}
                  height={30}
                  className='rounded-full'
                />
                {session?.user.name}
              </TableCell>
              <TableCell className="text-right">
                <span className='text-right font-semibold bg-gray-700/60 px-4 py-2 rounded-xl'>
                  {session?.user.total_commits}
                </span>
              </TableCell>
            </tr>
            {leaderboardData?.map((user, index) => (
              <tr
                key={user.id}
                className='hover:bg-gray-700/20 duration-200'
              >
                <TableCell className="font-medium text-2xl md:text-3xl">{index + 1}</TableCell>
                <TableCell className='flex gap-2 items-center'>
                  <Image
                    src={user.image as string}
                    alt={user.name as string}
                    width={30}
                    height={30}
                    className='rounded-full'
                  />
                  {user.name}
                </TableCell>
                <TableCell className="text-right">
                  <span className='text-right font-semibold bg-gray-700/60 px-4 py-2 rounded-xl'>
                    {user.total_commits}
                  </span>
                </TableCell>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

