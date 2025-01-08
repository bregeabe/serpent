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
      return {
        repoName: repo.name,
      };
    }));

    return new Response(JSON.stringify(repoDetails), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
