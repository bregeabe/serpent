export async function GET(request) {
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

      const commits = await response.json();
      return new Response(JSON.stringify({ repoName, commits }), { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }
