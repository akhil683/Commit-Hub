// The create-webhook route is responsible for adding webhooks
// to the user's repositories. 
// These webhooks are required to listen for push events in the 
// user's repos so that the app can mirror commits 
// into the code-tracking repo. Without calling this route, 
// webhooks won't be created, and commits won't be tracked.

import { db } from "@/lib/db/db";
import { WEBHOOK_URL } from "@/config/env";
import { accountsTable } from "@/lib/db/schema";
import { Octokit } from "@octokit/rest";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/utils";

export async function POST(req: NextRequest) {

  // Retrieve the user to access the accessToken
  const { user } = await req.json();
  const { id: userId } = user

  if (!userId) {
    return NextResponse.json(
      { message: 'Please login before creating repo!' },
      { status: 400 }
    );
  }

  //Fetch the account info of user
  const account = await db
    .select()
    .from(accountsTable)
    .where(eq(accountsTable.userId, userId))

  // Ignore, if there is no account
  if (!account) {
    return NextResponse.json(
      { message: 'Un-Authorized, account not found !' },
      { status: 400 }
    );
  }

  const decryptedToken = decrypt(account[0].private_access_token as string)

  try {
    const results: Array<{ repo: string; status: string; hook_id?: number }> = [];

    const octokit = new Octokit({ auth: decryptedToken });

    // Fetch authenticated user details
    const user = (await octokit.users.getAuthenticated()).data.login;
    console.log("Authenticated user:", user);

    // Fetch all user repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser();
    console.log("User repositories fetched:", repos.length);

    for (const repo of repos) {
      try {
        console.log(`Processing repository: ${repo.name}`);

        // Check if the webhook already exists
        const { data: hooks } = await octokit.repos.listWebhooks({
          owner: user,
          repo: repo.name,
        });

        const existingHook = hooks.find((hook) => hook.config.url === WEBHOOK_URL as string);

        if (existingHook) {
          console.log(`Webhook already exists for repo: ${repo.name}`);
          results.push({
            repo: repo.name,
            status: "Webhook already exists",
            hook_id: existingHook.id,
          });
          continue;
        }

        // Create a new webhook
        const { data: createdHook } = await octokit.repos.createWebhook({
          owner: user,
          repo: repo.name,
          config: {
            url: WEBHOOK_URL,
            content_type: "json",
          },
          events: ["push"],
        });

        console.log(`Webhook created for repo: ${repo.name}`);
        results.push({
          repo: repo.name,
          status: "Webhook created successfully",
          hook_id: createdHook.id,
        });
      } catch (repoError: any) {
        console.error(`Error creating webhook for repo ${repo.name}:`, repoError.message);
        results.push({
          repo: repo.name,
          status: `Error: ${repoError.message}`,
        });
      }
    }

    return NextResponse.json({
      message: "Webhook creation process completed",
      results,
    });
  } catch (error: any) {
    console.error("Error in webhook creation process:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
