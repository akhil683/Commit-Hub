"use client";

import axios from "axios";
import { signOut, useSession } from "next-auth/react";

interface SessionData {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  accessToken: string;
}

export default function CreateRepo() {
  const { data: session } = useSession();

  const createRepo = async () => {
    console.log(session, session?.accessToken)
    if (!session) return;

    try {
      const response = await axios.post("/api/create-repo", {
        accessToken: (session as SessionData).accessToken,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error creating repository:", error);
    }
  };

  const createWebhook = async () => {
    if (!session) return;
    try {
      const response = await axios.post("/api/create-webhook", {
        accessToken: (session as SessionData).accessToken,
      })
      console.log("webhook response", response)
    } catch (error) {
      console.log("Error creating webhook", error)
    }
  }

  return (
    <div className="flex flex-col gap-4 my-6">
      {session && (
        <>
          <button onClick={createRepo}>Create Tracking Repo</button>
          <button onClick={createWebhook}>Create Webhook</button>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      )}
    </div>
  );
}
