import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json();

  if (event.ref !== "refs/heads/main") {
    const repoName = "code-tracking";
    const userRepoName = event?.repository?.name;
    const commitMessage = event?.head_commit?.message;

    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
      });

      // Push commit to code-tracking repo
      await octokit.repos.createOrUpdateFileContents({
        owner: event.repository.owner.login,
        repo: repoName,
        path: `commits/${userRepoName}-${Date.now()}.txt`,
        message: `[${userRepoName}] ${commitMessage}`,
        content: Buffer.from(commitMessage).toString("base64"),
      });

      return NextResponse.json({ message: "Webhook handled successfully" });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: "No action required for main branch commits" });
  }
}
