const query = `
    query userPublicProfile($username: String!) {
            matchedUser(username: $username) {
            contestBadge {
                name
                expired
                hoverText
                icon
            }
            submitStats {
                acSubmissionNum {
                difficulty
                count
                submissions
                }
                totalSubmissionNum {
                difficulty
                count
                submissions
                }
            }
            username
            githubUrl
            twitterUrl
            linkedinUrl
            profile {
                ranking
                userAvatar
                realName
                aboutMe
                school
                websites
                countryName
                company
                jobTitle
                skillTags
                postViewCount
                postViewCountDiff
                reputation
                reputationDiff
                solutionCount
                solutionCountDiff
                categoryDiscussCount
                categoryDiscussCountDiff
            }  
            }
            recentSubmissionList(username: $username) {
                title
                titleSlug
                timestamp
                statusDisplay
                lang
                __typename
            }
            matchedUserStats: matchedUser(username: $username) {
                submitStats: submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                    __typename
                }
                totalSubmissionNum {
                    difficulty
                    count
                    submissions
                    __typename
                }
                __typename
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