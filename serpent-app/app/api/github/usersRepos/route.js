export async function GET(request) {
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
    const repoDetails = await Promise.all(repos.map(async (repo) => {
      // Fetch commits for each repository
      const commitsResponse = await fetch(repo.commits_url.replace('{/sha}', ''), {
        headers: { 'Authorization': `token ${token}` },
      });

      const issuesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/issues`, {
        headers: { 'Authorization': `token ${token}` },
      });

      const contributorsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/contributors`, {
        headers: { 'Authorization': `token ${token}` },
      });

      const commits = commitsResponse.ok ? await commitsResponse.json() : [];
      const issues = issuesResponse.ok ? await issuesResponse.json() : [];
      const contributors = contributorsResponse.ok ? await contributorsResponse.json() : [];

      return {
        repoName: repo.name,
        commits,
        issues,
        contributors,
      };
    }));

    return new Response(JSON.stringify(repoDetails), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
