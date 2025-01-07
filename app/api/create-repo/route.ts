import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
// import { GITHUB_PERSONAL_ACCESS_TOKEN } from '@/config/env';
import { db } from '@/lib/db/db';
import { eq } from 'drizzle-orm';
import { accountsTable } from '@/lib/db/schema';
import { decrypt } from '@/lib/utils';

export async function POST(req: Request) {
  console.log("create-repo running...")
  const { user } = await req.json();
  const { id: userId } = user

  try {
    if (!userId) {
      return NextResponse.json(
        { message: 'Please login before creating repo!' },
        { status: 400 }
      );
    }

    const account = await db
      .select()
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId))

    console.log(account)

    if (!account) {
      return NextResponse.json(
        { message: 'Un-Authorized, account not found !' },
        { status: 400 }
      );
    }

    const decryptedToken = decrypt(account[0].private_access_token as string)
    console.log(decryptedToken)

    // Create an instance of Octokit with the provided access token
    const octokit = new Octokit({
      // auth: accessToken,
      auth: decryptedToken
    });

    // Fetch the authenticated user's info
    const user = await octokit.users.getAuthenticated();

    // check whether the repository already exists or not
    const repoName = 'codetracking';
    const existingRepo = await octokit.repos
      .get({
        owner: user.data.login,
        repo: repoName,
      })
      .catch(() => null);

    if (existingRepo) {
      console.log('Repo already exists')
      return NextResponse.json(
        { message: 'Repository already exists' },
        { status: 400 });
    }

    // Create code-tracking repository
    // Here commit will be done automatically when you push to any branch
    // of any repo except main, so that commit wil count 
    // to the green dots in github profile
    const createRepoResponse = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: "Track the daily coding accurately in one repo",
      auto_init: true,
      homepage: "https://auto-commit-hub.vercel.app",
      private: true,
    });
    console.log(createRepoResponse.data)

    return NextResponse.json({ data: createRepoResponse.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating repo:', error);
    return NextResponse.json({ message: 'Error creating repo', error: error.message }, { status: 500 });
  }
}
