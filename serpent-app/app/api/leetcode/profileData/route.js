import { upsertLeetCodeProfile, getProfileIdFromUserId } from "../../../../db/utils/leetcode/handle-saving";
const query = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
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
        categoryDiscussCount
        categoryDiscussCountDiff
    }
    badges {
        name
    }
    submitStats {
        totalSubmissionNum {
        difficulty
        count
        submissions
        }
    }
    userCalendar(year: 2025) {
      activeYears
      streak
      totalActiveDays
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

    if (data.errors) {
      return new Response(JSON.stringify({ error: 'Error fetching data', details: data.errors }), {
        status: 500,
      });
    }
    const profileId = await getProfileIdFromUserId(process.env.USER_ID);
    const userData = data.data.matchedUser;
    const profileData = {
        profile_id: profileId || null,
        user_id: process.env.USER_ID,
        username: userData.username,
        name: userData.profile.realName || null,
        url: `https://leetcode.com/${userData.username}`,
        bio: userData.profile.aboutMe || null,
        user_rank: userData.profile.ranking || null,
        company: userData.profile.company || null,
        school: userData.profile.school || null,
        badges: userData.badges.map(badge => badge.name) || [],
        websites: userData.profile.websites || [],
        skills: userData.profile.skillTags || [],
        rep: userData.profile.reputation || 0,
        view_count: userData.profile.postViewCount || 0,
        active_years: userData.userCalendar.activeYears || [],
        streak: userData.userCalendar.streak || 0,
        active_days: userData.userCalendar.totalActiveDays || 0,
        solution_count: userData.profile.solutionCount || 0,
        total_submitted: userData.submitStats.totalSubmissionNum.reduce((acc, obj) => acc + obj.submissions, 0) || 0,
        total_accepted: userData.submitStats.totalSubmissionNum.reduce((acc, obj) => acc + obj.count, 0) || 0,
        easy_submitted: userData.submitStats.totalSubmissionNum.find(obj => obj.difficulty === 'Easy')?.submissions || 0,
        easy_accepted: userData.submitStats.totalSubmissionNum.find(obj => obj.difficulty === 'Easy')?.count || 0,
        medium_submitted: userData.submitStats.totalSubmissionNum.find(obj => obj.difficulty === 'Medium')?.submissions || 0,
        medium_accepted: userData.submitStats.totalSubmissionNum.find(obj => obj.difficulty === 'Medium')?.count || 0,
        hard_submitted: userData.submitStats.totalSubmissionNum.find(obj => obj.difficulty === 'Hard')?.submissions || 0,
        hard_accepted: userData.submitStats.totalSubmissionNum.find(obj => obj.difficulty === 'Hard')?.count || 0,
    };

    await upsertLeetCodeProfile(profileData);

    return new Response(JSON.stringify(data.data), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
