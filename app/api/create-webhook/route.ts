import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

interface CreateWebhookRequestBody {
  accessToken: string;
}

export async function POST(req: NextRequest) {
  const body: CreateWebhookRequestBody = await req.json();

  try {
    const octokit = new Octokit({ auth: body.accessToken });

    // Fetch all user repositories
    const { data: repos } = await octokit.repos.listForAuthenticatedUser();

    for (const repo of repos) {
      await octokit.repos.createWebhook({
        owner: (await octokit.users.getAuthenticated()).data.login,
        repo: repo.name,
        config: {
          url: "http://localhost:3000/api/handle-webhook",
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
