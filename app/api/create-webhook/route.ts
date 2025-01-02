// The create-webhook route is responsible for adding webhooks
// to the user's repositories. 
// These webhooks are required to listen for push events in the 
// user's repos so that the app can mirror commits 
// into the code-tracking repo. Without calling this route, 
// webhooks won't be created, and commits won't be tracked.

import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

interface CreateWebhookRequestBody {
  accessToken: string;
}

export async function POST(req: NextRequest) {
  const body: CreateWebhookRequestBody = await req.json();
  console.log(body.accessToken)

  //Encrypt the accessToken  using AES
  const encryptedToken = CryptoJS.AES.encrypt(body.accessToken, process.env.ENCRYPT_KEY!).toString()
  console.log(encryptedToken)

  try {
    const octokit = new Octokit({
      auth: body.accessToken
      // auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    });
    const results = []

    // Fetch all user repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser();
    const user = (await octokit.users.getAuthenticated()).data.login
    const webhookURL = "https://7727-2409-40d7-100b-8dce-d44c-14c7-82d1-385b.ngrok-free.app/api/handle-webhook"

    for (const repo of repos) {
      try {
        //Check if the webhook already exists
        const { data: hooks } = await octokit.repos.listWebhooks({
          owner: user,
          repo: repo.name
        })
        const existingHook = hooks.find((hook) =>
          hook.config.url === webhookURL
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
        const { data: createdHook } = await octokit.repos.createWebhook({
          owner: user,
          repo: repo.name,
          config: {
            url: `${webhookURL}?token=${body.accessToken}`,
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
