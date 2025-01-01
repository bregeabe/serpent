const query = `
    query userSolutionTopics($username: String!, $orderBy: TopicSortingOption, $skip: Int, $first: Int) {
        userSolutionTopics(
            username: $username
            orderBy: $orderBy
            skip: $skip
            first: $first
        ) {
            edges {
                node {
                    id
                    title
                    url
                    viewCount
                    questionTitle
                    post {
                        creationDate
                        voteCount
                    }
                }
            }
        }
    }
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const results = searchParams.get("results") ?? 10;

  if (!username) {
    return new Response(
      JSON.stringify({ error: "Username is required" }),
      { status: 400 }
    );
  }

  const orderBy = "newest_to_oldest";
  const skip = 0;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username, orderBy, skip, results },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return new Response(
        JSON.stringify({ error: "Error fetching data", details: data.errors }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data.data), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
