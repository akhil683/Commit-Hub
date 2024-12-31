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

    const { data: repos } = await octokit.repos.listForAuthenticatedUser();
    console.log("repository", repos)
    if (existingRepo) {
      return NextResponse.json({ message: 'Repository already exists' }, { status: 400 });
    }

    // Create new repository
    const createRepoResponse = await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName,
      private: true,
      auto_init: true,
    });

    return NextResponse.json({ data: createRepoResponse.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating repo:', error);
    return NextResponse.json({ message: 'Error creating repo', error: error.message }, { status: 500 });
  }
}
