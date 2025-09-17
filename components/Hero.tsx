"use client";

import { motion } from "framer-motion";
import { SpaceBackground } from "./SpaceBackground";
import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("github", { callbackUrl: "/user-profile" });
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen flex items-center">
      <SpaceBackground />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl md:text-7xl font-bold text-center mb-6"
        >
          Track Your Code,{" "}
          <span className="bg-gradient-to-b from-indigo-300 to-primary text-transparent bg-clip-text">
            Amplify Your Profile
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-lg md:text-xl text-center text-gray-300 mb-8"
        >
          Automatically sync your non-main branch commits to light up your
          GitHub contribution graph.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex justify-center"
        >
          {/* <WaitListForm /> */}
          {session ? (
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Link href={"/user-profile"}>Dashboard</Link>
            </Button>
          ) : (
            <Button
              onClick={handleSignIn}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Github />
                  SignIn via Github
                </>
              )}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
