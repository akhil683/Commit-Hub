import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(req: Request) {
  const { accessToken } = await req.json();
  console.log(accessToken)
  try {
    if (!accessToken) {
      return NextResponse.json({ message: 'Access token is missing' }, { status: 400 });
    }

    // Create an instance of Octokit with the provided access token
    const octokit = new Octokit({
      auth: accessToken,
      // auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
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
      return NextResponse.json({ message: 'Repository already exists' }, { status: 400 });
    }

    // Create code-tracking repository
    // Here commit will be done automatically when you push to any branch
    // of any repo except main, so that commit wil count 
    // to the green dots in github profile
    const createRepoResponse = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      description: "Track the daily coding accurately in one repo",
      auto_init: true,
      homepage: "https://localhost:3000"
    });
    console.log(createRepoResponse.data)

    return NextResponse.json({ data: createRepoResponse.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating repo:', error);
    return NextResponse.json({ message: 'Error creating repo', error: error.message }, { status: 500 });
  }
}
