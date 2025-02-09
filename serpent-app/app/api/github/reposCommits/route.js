import { upsertGithubCommit, doesGithubCommitExist, getRepoIdFromName } from '../../../../db/utils/github/handle-saving'
import { authenticateRequest } from '../../../../db/utils/auth/authenticate_request';

export async function POST(request) {
  const auth = authenticateRequest(request);
  if (auth.error) {
      return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const repoName = searchParams.get('repoName');

    if (!username || !repoName) {
      return new Response(JSON.stringify({ error: 'Username and repoName are required' }), { status: 400 });
    }

    const token = process.env.GITHUB_API_TOKEN;
    const url = `https://api.github.com/repos/${username}/${repoName}/commits`;

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
          JSON.stringify({ error: 'Error fetching commits', details: errorData }),
          { status: response.status }
        );
      }

      const repoId = await getRepoIdFromName(repoName);

      const commits = await response.json();
      const commitDataList = await Promise.all(commits.map(async (commit) => {
          const commitSha = commit.sha;
          const existingCommit = await doesGithubCommitExist(commitSha);

          return {
              commit_id: existingCommit,
              repo_id: repoId,
              sha: commit.sha,
              url: commit.html_url,
              message: commit.commit.message || null,
              date: commit.commit.author.date
                  ? new Date(commit.commit.author.date).toISOString().slice(0, 19).replace("T", " ")
                  : null,
              committer_username: commit.commit.committer?.name || null,
              committer_id: commit.committer?.id || null,
          };
      }));

      for (const commitData of commitDataList) {
          await upsertGithubCommit(commitData);
      }
      return new Response(JSON.stringify({ success: true, inserted: commitDataList.length }), { status: 200 });
  } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }
