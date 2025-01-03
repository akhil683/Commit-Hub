import { Octokit } from "@octokit/rest";
import { NextRequest, NextResponse } from "next/server";

interface FileDataType {
  content: string,
  sha: string
}


export async function POST(req: NextRequest) {

  const event = await req.json();

  // Check if commit is in main branch or not
  if (event.ref !== "refs/heads/main") {
    const repoName = "code-tracking";
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
        auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || ""
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
        fileContent = Buffer.from(fileData.content, 'base64').toString()
        sha = fileData.sha

      } catch (fileError: any) {
        if (fileError.status === 404) {
          fileContent = ""
        } else {
          console.log(fileError)
        }
      }

      // Push commit to code-tracking repo
      await octokit.repos.createOrUpdateFileContents({
        owner: user,
        repo: repoName,
        path: filePath,
        message: newCommitMessage,
        content: Buffer.from(fileContent + "\n" + newCommitMessage).toString("base64"),
        sha
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
