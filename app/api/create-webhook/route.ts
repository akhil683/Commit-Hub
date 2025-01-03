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
  console.log(body.accessToken)
  const webhookBaseURL = " https://f8f1-2409-40d7-e-ae97-5188-b329-f9a-63c8.ngrok-free.app"
  const accessToken = body.accessToken

  try {
    const octokit = new Octokit({
      auth: accessToken
    });
    const results = []

    // Fetch all user repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser();
    const user = (await octokit.users.getAuthenticated()).data.login

    for (const repo of repos) {
      try {
        //Check if the webhook already exists
        const { data: hooks } = await octokit.repos.listWebhooks({
          owner: user,
          repo: repo.name,
        })
        const existingHook = hooks.find((hook) =>
          hook.config.url === webhookBaseURL
        )
        if (existingHook) {
          results.push({
            repo: repo.name,
            status: "Webhook already exists",
            hook_id: existingHook.id
          })
          continue
        }

        // Create new webhook
        console.log()
        const { data: createdHook } = await octokit.repos.createWebhook({
          owner: user,
          repo: repo.name,
          config: {
            url: webhookBaseURL,
            content_type: "json",
          },
          events: ["push"],
        });

        results.push({
          repo: repo.name,
          status: 'Webhook created successfullly',
          hook_id: createdHook.id
        })
      } catch (repoError: any) {
        console.error(`Error creating webhook for repo ${repo.name}:`)
        results.push({ repo: repo.name, status: `Error: ${repoError.message}` })
      }
    }

    return NextResponse.json({
      message: "Webhooks created successfully",
      results
    });

  } catch (error: any) {
    console.error("Error creating webhook: ", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
