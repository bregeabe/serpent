const query = `
    query languageStats($username: String!) {
        matchedUser(username: $username) {
                languageProblemCount {
                        languageName
                                problemsSolved
                                }
                            }
                            }
`;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
    }

    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
        },
        body: JSON.stringify({ query, variables: { username } }),
      });

      const data = await response.json();

      if (data.errors) {
        return new Response(JSON.stringify({ error: 'Error fetching data', details: data.errors }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify(data.data), { status: 200 });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }