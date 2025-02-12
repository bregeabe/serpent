import { upsertLeetCodeSubmissions, doesLeetCodeSubmissionExist, getProfileIdFromUserId } from "../../../../db/utils/leetcode/handle-saving";


const recentSubmissionsQuery = `
    query userPublicProfile($username: String!) {
        recentSubmissionList(username: $username) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
            __typename
        }
    }
`;

const problemDetailsQuery = `
    query problemDifficulty($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            title
            difficulty
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
        const recentResponse = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Referer: 'https://leetcode.com',
            },
            body: JSON.stringify({ query: recentSubmissionsQuery, variables: { username } }),
        });

        const recentData = await recentResponse.json();

        if (recentData.errors) {
            return new Response(
                JSON.stringify({ error: 'Error fetching recent submissions', details: recentData.errors }),
                { status: 500 }
            );
        }

        const submissions = recentData.data.recentSubmissionList;

        const submissionsWithDifficulty = await Promise.all(
            submissions.map(async (submission) => {
                const problemResponse = await fetch('https://leetcode.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Referer: 'https://leetcode.com',
                    },
                    body: JSON.stringify({
                        query: problemDetailsQuery,
                        variables: { titleSlug: submission.titleSlug },
                    }),
                });

                const problemData = await problemResponse.json();

                if (problemData.errors) {
                    console.error('Error fetching problem details:', problemData.errors);
                    return {
                        ...submission,
                        difficulty: 'Unknown',
                    };
                }

                return {
                    ...submission,
                    difficulty: problemData.data.question.difficulty,
                };
            })
        );
        const profileId = await getProfileIdFromUserId(process.env.USER_ID);

        const submissionsData = await Promise.all(
            submissionsWithDifficulty.map(async (submission) => {
                const timestampFormatted = submission.timestamp
                    ? new Date(submission.timestamp * 1000).toISOString().slice(0, 19).replace("T", " ")
                    : null;

                const existingSubmissionId = await doesLeetCodeSubmissionExist(profileId, timestampFormatted);

                return {
                    submissions_id: existingSubmissionId,
                    profile_id: profileId,
                    problem: submission.title,
                    status: submission.statusDisplay,
                    language: submission.lang,
                    difficulty: submission.difficulty,
                    created_at: timestampFormatted,
                };
            })
        );

        await upsertLeetCodeSubmissions(submissionsData);


        return new Response(JSON.stringify({ submissions: submissionsWithDifficulty }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
