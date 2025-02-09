import { authenticateRequest } from '../../../../db/utils/auth/authenticate_request';
import { upsertGithubProfile, doesGithubProfileExist } from '../../../../db/utils/github/handle-saving'


export async function POST(request) {
  console.log('Received Headers:', request.headers);
  const auth = authenticateRequest(request);
  if (auth.error) {
      return new Response(JSON.stringify({ error: auth.error }), { status: auth.status });
  }
  console.log(auth)
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
  }

  const token = process.env.GITHUB_API_TOKEN;
  const url = `https://api.github.com/users/${username}`;

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

    const data = await response.json();

    const existingProfileId = await doesGithubProfileExist(data.id);

    const profileData = {
      profile_id: existingProfileId,
      github_id: data.id,
      user_id: auth.user_id,
      username: data.login,
      name: data.name || null,
      url: data.html_url,
      bio: data.bio || null,
      num_repos: data.public_repos || 0,
      followers: data.followers || 0,
      following: data.following || 0,
      account_created: data.created_at
        ? new Date(data.created_at).toISOString().slice(0, 19).replace("T", " ") 
        : null
    };

    await upsertGithubProfile(profileData);

    return new Response(JSON.stringify({ success: true, profile: profileData }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
