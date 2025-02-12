import { upsertLeetCodeLanguages, getProfileIdFromUserId, doesLanguageExist } from "../../../../db/utils/leetcode/handle-saving";

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

export async function POST(request) {
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
      const userData = data.data.matchedUser;

      const profileId = await getProfileIdFromUserId(process.env.USER_ID);
      if (!profileId) {
          return new Response(JSON.stringify({ error: 'User profile not found' }), { status: 404 });
      }

      const languagesData = await Promise.all(userData.languageProblemCount.map(async (language) => ({
        language_id: await doesLanguageExist(language.languageName),
        profile_id: profileId,
        name: language.languageName,
        solved: language.problemsSolved
      })));

      await upsertLeetCodeLanguages(languagesData);

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