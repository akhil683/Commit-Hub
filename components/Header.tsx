"use client";

import { motion } from "framer-motion";
import { SignIn } from "./sign-in";
import Link from "next/link";
import { DollarSign, LayoutDashboard, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={"/"}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-bold bg-gradient-to-b from-indigo-300 to-primary text-transparent bg-clip-text"
          >
            Commit Hub
          </motion.div>
        </Link>
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                {session?.user.subscription && (
                  <p className="bg-yellow-700 text-[8px] px-1 py-0 rounded-full absolute z-30 top-0 -right-2">
                    {session?.user?.subscription}
                  </p>
                )}
                <Avatar
                  className={`w-8 h-8 border-2 ${session?.user.subscription === "Pro" ? "border-yellow-600" : "border-transparent"}`}
                >
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                    className={``}
                  />
                  <AvatarFallback>
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-gray-800 space-y-2 p-2 rounded-xl border-gray-700 text-white"
              align="end"
              forceMount
            >
              <DropdownMenuItem asChild className="hover:bg-gray-700">
                <Link
                  href="/user-profile"
                  className="flex items-center cursor-pointer"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem asChild className="hover:bg-gray-700">
                <Link
                  href="/leaderboard"
                  className="flex items-center cursor-pointer"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>Leaderboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem asChild className="hover:bg-gray-700">
                <Link
                  href="/subscription"
                  className="flex items-center cursor-pointer"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <div className="w-full flex justify-center items-center">
                <SignIn />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}
