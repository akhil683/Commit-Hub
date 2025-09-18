import { db } from "@/lib/db/db";
import { accountsTable, usersTable } from "@/lib/db/schema";
import { decrypt } from "@/lib/utils";
import { Octokit } from "@octokit/rest";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface FileDataType {
  content: string;
  sha: string;
}

//TODO: Handle free quota
export async function POST(req: NextRequest) {
  const action = req.headers.get("x-github-event");

  //ignore ping event triggered by github to test webhook
  if (action === "ping") {
    return NextResponse.json({ message: "Unsupported event" }, { status: 200 });
  }

  // 🔹 Handle repository creation event
  if (action === "repository") {
    const event = await req.json();

    if (event.action === "created") {
      const repoName = event.repository.name;
      const user = event.repository.owner.login;

      try {
        // Try to resolve email (fallback to sender if not available)
        const userEmail =
          event.sender?.email || event.repository?.owner?.email || null;

        if (!userEmail) {
          return NextResponse.json(
            { error: "User email not found in event" },
            { status: 400 },
          );
        }

        // Get user from DB
        const userObject = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, userEmail));

        if (
          userObject[0] &&
          userObject[0]?.total_commits! > 10 &&
          userObject[0]?.subscription! !== "Pro"
        ) {
          return NextResponse.json(
            { error: "Upgrade to the premium plan to continue the service." },
            { status: 400 },
          );
        }
        if (!userObject[0]) {
          return NextResponse.json(
            { error: "User not found in DB" },
            { status: 404 },
          );
        }

        // Get account from DB to get token
        const account = await db
          .select()
          .from(accountsTable)
          .where(eq(accountsTable.userId, userObject[0].id));

        if (!account[0]) {
          return NextResponse.json(
            { error: "Account not found in DB" },
            { status: 404 },
          );
        }

        const GITHUB_PERSONAL_ACCESS_TOKEN = decrypt(
          account[0].private_access_token as string,
        );

        const octokit = new Octokit({
          auth: GITHUB_PERSONAL_ACCESS_TOKEN,
        });

        // 🔹 Create webhook in the new repo automatically
        await octokit.repos.createWebhook({
          owner: user,
          repo: repoName,
          config: {
            url: process.env.WEBHOOK_URL!, // Your webhook endpoint
            content_type: "json",
            secret: process.env.WEBHOOK_SECRET || "", // optional but recommended
            insecure_ssl: "0",
          },
          events: ["push"], // only listen to push events
        });

        return NextResponse.json(
          { message: `Webhook created for repo ${repoName}` },
          { status: 201 },
        );
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json(
      { message: "Repository event ignored" },
      { status: 200 },
    );
  }

  // 🔹 Handle push events
  if (action !== "push") {
    return NextResponse.json({ message: "Unsupported event" }, { status: 200 });
  }

  const event = await req.json();

  //Validate the event payload
  if (!event || !event.ref || !event.repository || !event.head_commit) {
    return NextResponse.json(
      { error: "Invalid event payload" },
      { status: 400 },
    );
  }

  // Process non-main branch commits
  if (event.ref !== "refs/heads/main") {
    const repoName = "codetracking";
    const userRepoName = event?.repository?.name;
    const commitMessage = event?.head_commit?.message;
    const branchName = event?.ref?.split("/")[2]; // refs/heads/main
    const user = event?.repository?.owner?.login;
    const newCommitMessage = `[${userRepoName}][${branchName}] -> ${commitMessage}`;

    try {
      //get user email from the event.
      const userEmail = event.head_commit.author.email;

      // Get User from db via email to get account
      const userObject = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userEmail));

      // If user has more than 3 commits then need subscription
      if (
        userObject[0].total_commits === 3 &&
        userObject[0].subscription === "none"
      ) {
        return NextResponse.json(
          { error: "Maximum commits reached. Require subscription" },
          { status: 500 },
        );
      }

      // Get account from db via userId to get private_access_token
      const account = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.userId, userObject[0].id));

      // Get private_access_token from account object
      const GITHUB_PERSONAL_ACCESS_TOKEN = decrypt(
        account[0].private_access_token as string,
      );

      const octokit = new Octokit({
        auth: GITHUB_PERSONAL_ACCESS_TOKEN,
      });

      //check if the file already exists in the target repository
      const filePath = `${userRepoName}.txt`;
      let fileContent = "";
      let sha = "";

      try {
        // Get the file content if it exists
        const { data } = await octokit.repos.getContent({
          owner: user,
          repo: repoName,
          path: filePath,
        });
        const fileData = data as FileDataType;
        fileContent = fileData.content
          ? Buffer.from(fileData.content, "base64").toString()
          : "";
        sha = fileData.sha;
      } catch (fileError: any) {
        if (fileError.status === 404) {
          fileContent = "";
        } else {
          return NextResponse.json(
            { error: "Error fetching files" },
            { status: 500 },
          );
        }
      }

      // Push commit to code-tracking repo
      await octokit.repos.createOrUpdateFileContents({
        owner: user,
        repo: repoName,
        path: filePath,
        message: newCommitMessage,
        content: Buffer.from(fileContent + "\n \n" + newCommitMessage).toString(
          "base64",
        ),
        sha: sha || undefined,
      });

      // Increment the number of commits by 1
      await db
        .update(usersTable)
        .set({
          total_commits: sql`${usersTable.total_commits} + 1`,
        })
        .where(eq(usersTable.id, userObject[0].id));

      //return response upon completion
      return NextResponse.json(
        { message: "Webhook handled successfully" },
        { status: 200 },
      );
    } catch (error: any) {
      // return response for error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    return NextResponse.json({
      message: "No action required for main branch commits",
    });
  }
}
// import { db } from "@/lib/db/db";
// import { accountsTable, usersTable } from "@/lib/db/schema";
// import { decrypt } from "@/lib/utils";
// import { Octokit } from "@octokit/rest";
// import { eq, sql } from "drizzle-orm";
// import { NextRequest, NextResponse } from "next/server";
//
// interface FileDataType {
//   content: string,
//   sha: string
// }
//
// export async function POST(req: NextRequest) {
//   const action = req.headers.get("x-github-event")
//
//   //ignore ping event  triggered by github to test webhook
//   if (action === "ping") {
//     return NextResponse.json({ message: "Unsupported event" }, { status: 200 })
//   }
//   //Ignor events which are not push events
//   if (action !== "push") {
//     return NextResponse.json({ message: "Unsupported event" }, { status: 200 });
//   }
//
//   const event = await req.json();
//
//   //Validate the event payload
//   if (
//     !event ||
//     !event.ref ||
//     !event.repository ||
//     !event.head_commit
//   ) {
//     return NextResponse.json(
//       { error: "Invalid event payload" },
//       { status: 400 }
//     );
//   }
//
//
//   // Process non-main branch commits
//   if (event.ref !== "refs/heads/main") {
//     const repoName = "codetracking";
//     const userRepoName = event?.repository?.name;
//     const commitMessage = event?.head_commit?.message;
//     const branchName = event?.ref?.split("/")[2] // refs/heads/main
//     const user = event?.repository?.owner?.login
//     const newCommitMessage = `[${userRepoName}][${branchName}] -> ${commitMessage}`
//
//     try {
//       //get user email from the event.
//       const userEmail = event.head_commit.author.email
//
//       // Get User from db via email to get account
//       const userObject = await db
//         .select()
//         .from(usersTable)
//         .where(eq(usersTable.email, userEmail))
//
//       // If user has more than 3 comits then need subscription
//       if (userObject[0].total_commits === 3 && userObject[0].subscription === "none") {
//         return NextResponse.json(
//           { error: "Maximum commits reached. Require subscription" },
//           { status: 500 }
//         )
//       }
//
//       // Get account from db via userId to get private_access_token
//       const account = await db
//         .select()
//         .from(accountsTable)
//         .where(eq(accountsTable.userId, userObject[0].id))
//
//       // Get private_access_token from account object
//       const GITHUB_PERSONAL_ACCESS_TOKEN = decrypt(account[0].private_access_token as string)
//
//       const octokit = new Octokit({
//         auth: GITHUB_PERSONAL_ACCESS_TOKEN
//       });
//
//       //check if the file already exists in the target repository
//       const filePath = `${userRepoName}.txt`
//       let fileContent = ""
//       let sha = ""
//
//       try {
//         // Get the file content if it exists
//         const { data } = await octokit.repos.getContent({
//           owner: user,
//           repo: repoName,
//           path: filePath,
//         })
//         const fileData = data as FileDataType
//         fileContent = fileData.content ? Buffer.from(fileData.content, 'base64').toString() : ""
//         sha = fileData.sha
//
//       } catch (fileError: any) {
//         if (fileError.status === 404) {
//           fileContent = ""
//         } else {
//           return NextResponse.json(
//             { error: "Error fetching files" },
//             { status: 500 }
//           )
//         }
//       }
//
//       // Push commit to code-tracking repo
//       await octokit.repos.createOrUpdateFileContents({
//         owner: user,
//         repo: repoName,
//         path: filePath,
//         message: newCommitMessage,
//         content: Buffer.from(fileContent + "\n \n" + newCommitMessage).toString("base64"),
//         sha: sha || undefined
//       });
//
//       // Increment the number of commits by 1
//       await db
//         .update(usersTable)
//         .set({
//           total_commits: sql`${usersTable.total_commits} + 1`
//         })
//         .where(eq(usersTable.id, userObject[0].id))
//
//       //return response upon completion
//       return NextResponse.json(
//         { message: "Webhook handled successfully" },
//         { status: 200 }
//       );
//
//     } catch (error: any) {
//       // return response for error
//       return NextResponse.json(
//         { error: error.message },
//         { status: 500 }
//       );
//     }
//
//   } else {
//     return NextResponse.json(
//       { message: "No action required for main branch commits" });
//   }
// }
