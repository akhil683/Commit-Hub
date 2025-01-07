import { GITHUB_PERSONAL_ACCESS_TOKEN } from "@/config/env";
import { db } from "@/lib/db/db";
import { usersTable } from "@/lib/db/schema";
import { Octokit } from "@octokit/rest";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface FileDataType {
  content: string,
  sha: string
}


export async function POST(req: NextRequest) {
  const action = req.headers.get("x-github-event")
  console.log(action)

  //ignore ping event  triggered by github to test webhook
  if (action === "ping") {
    console.log("Received ping event. Ignoring")
    return NextResponse.json({ message: "Unsupported event" }, { status: 200 })
  }
  //Ignor events which are not push events
  if (action !== "push") {
    console.log(`Received unsupported event: ${action}. Ignoring.`);
    return NextResponse.json({ message: "Unsupported event" }, { status: 200 });
  }

  const event = await req.json();
  console.log(event)
  //Validate the event payload
  if (!event || !event.ref || !event.repository || !event.head_commit) {
    return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
  }


  // Process non-main branch commits
  if (event.ref !== "refs/heads/main") {
    const repoName = "codetracking";
    const userRepoName = event?.repository?.name;
    const commitMessage = event?.head_commit?.message;
    const branchName = event?.ref?.split("/")[2] // refs/heads/main
    const user = event?.repository?.owner?.login
    const newCommitMessage = `[${userRepoName}][${branchName}] -> ${commitMessage}`

    console.log(
      repoName,
      userRepoName,
      commitMessage,
      branchName,
      newCommitMessage,
      user
    )

    try {
      const octokit = new Octokit({
        // auth: encryptedToken
        auth: GITHUB_PERSONAL_ACCESS_TOKEN
      });

      //check if the file already exists in the target repository
      const filePath = `${userRepoName}.txt`
      let fileContent = ""
      let sha = ""

      try {
        // Get the file content if it exists
        const { data } = await octokit.repos.getContent({
          owner: user,
          repo: repoName,
          path: filePath,
        })
        const fileData = data as FileDataType
        fileContent = fileData.content ? Buffer.from(fileData.content, 'base64').toString() : ""
        sha = fileData.sha

      } catch (fileError: any) {
        if (fileError.status === 404) {
          fileContent = ""
        } else {
          console.log(fileError)
          return NextResponse.json({ error: "Error fetching files" }, { status: 500 })
        }
      }

      // Push commit to code-tracking repo
      await octokit.repos.createOrUpdateFileContents({
        owner: user,
        repo: repoName,
        path: filePath,
        message: newCommitMessage,
        content: Buffer.from(fileContent + "\n" + newCommitMessage).toString("base64"),
        sha: sha || undefined
      });

      // await db
      //   .update(usersTable)
      // .set({ total_commits: })
      //   .where(eq(usersTable.id, userId))

      return NextResponse.json({ message: "Webhook handled successfully" });

    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

  } else {
    return NextResponse.json({ message: "No action required for main branch commits" });
  }
}
