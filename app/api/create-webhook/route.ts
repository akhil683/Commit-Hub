// The create-webhook route is responsible for adding webhooks
// to the user's repositories. 
// These webhooks are required to listen for push events in the 
// user's repos so that the app can mirror commits 
// into the code-tracking repo. Without calling this route, 
// webhooks won't be created, and commits won't be tracked.

import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

interface CreateWebhookRequestBody {
  accessToken: string;
}

export async function POST(req: NextRequest) {
  const body: CreateWebhookRequestBody = await req.json();

  try {
    const octokit = new Octokit({
      // auth: body.accessToken 
      auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });

    // Fetch all user repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser();

    for (const repo of repos) {
      await octokit.repos.createWebhook({
        owner: (await octokit.users.getAuthenticated()).data.login,
        repo: repo.name,
        config: {
          url: "https://d34d-2409-40d7-100b-4f00-ec60-1d29-56a3-7be0.ngrok-free.app/api/handle-webhook",
          content_type: "json",
        },
        events: ["push"],
      });
    }

    return NextResponse.json({ message: "Webhooks created successfully" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
