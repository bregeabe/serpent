const query = `
    query questionOfToday {
        activeDailyCodingChallengeQuestion {
        date
        userStatus
        link
        question {
            acRate
            difficulty
            freqBar
            frontendQuestionId: questionFrontendId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            hasVideoSolution
            hasSolution
            topicTags {
            name
            id
            slug
            }
        }
        }
        allQuestionsCount {
            difficulty
            count
        }
    }
`;

export async function GET(request) {
    const { searchParams } = new URL(request.url);

    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com',
        },
        body: JSON.stringify({ query, variables: {} }),
      });

      const data = await response.json();

      if (data.errors) {
        return new Response(JSON.stringify({ error: 'Error fetching data', details: data.errors }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify(data.data),  { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  }
