import { upsertGithubRepo, doesGithubRepoExist, getProfileIdFromUserId } from '../../../../db/utils/github/handle-saving'
import { authenticateRequest } from '../../../../db/utils/auth/authenticate_request';

export async function POST(request) {
  const auth = authenticateRequest(request);
  if (auth.error) {
      return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
  }

  const token = process.env.GITHUB_API_TOKEN;
  const url = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: 'Error fetching data', details: errorData }),
        { status: response.status }
      );
    }

    const repos = await response.json();
    const profileId = await getProfileIdFromUserId(auth.user_id);
    const repoDataList = await Promise.all(repos.map(async (repo) => {
      const existingRepoId = await doesGithubRepoExist(repo.name);

      return {
        repo_id: existingRepoId,
        profile_id: profileId,
        name: repo.name,
        url: repo.html_url
      };
    }));

    for (const repoData of repoDataList) {
      await upsertGithubRepo(repoData);
    }

    return new Response(JSON.stringify({ success: true, inserted: repoDataList.length }), { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
