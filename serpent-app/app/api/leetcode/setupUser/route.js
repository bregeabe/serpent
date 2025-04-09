import {
  upsertLeetCodeProfile,
  upsertLeetCodeLanguages,
  upsertLeetCodeSolutions,
  upsertLeetCodeSubmissions,
  doesLeetCodeSubmissionExist,
  doesLeetCodeSolutionExist,
  getProfileIdFromUserId,
  doesLanguageExist,
} from "../../../../db/utils/leetcode/handle-saving";

import { v4 as uuidv4 } from 'uuid';

const profileQuery = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile {
      ranking
      realName
      aboutMe
      school
      websites
      company
      skillTags
      postViewCount
      reputation
      solutionCount
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

const languagesQuery = `
query languageStats($username: String!) {
  matchedUser(username: $username) {
    languageProblemCount {
      languageName
      problemsSolved
    }
  }
}
`;

const solutionsQuery = `
query userSolutionTopics($username: String!, $orderBy: TopicSortingOption, $skip: Int, $first: Int) {
  userSolutionTopics(username: $username, orderBy: $orderBy, skip: $skip, first: $first) {
    edges {
      node {
        id
        title
        url
        viewCount
        questionTitle
        post {
          voteCount
        }
      }
    }
  }
}
`;

const recentSubmissionsQuery = `
query userPublicProfile($username: String!) {
  recentSubmissionList(username: $username) {
    title
    titleSlug
    timestamp
    statusDisplay
    lang
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
  const userId = process.env.USER_ID;

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
  }

  try {
    // === 1. PROFILE ===
    const profileRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query: profileQuery, variables: { username } }),
    });

    const profileJson = await profileRes.json();
    const profileData = profileJson.data?.matchedUser;
    const profileId = await getProfileIdFromUserId(userId) || uuidv4();

    const userProfile = {
      profile_id: profileId,
      user_id: userId,
      username,
      name: profileData.profile.realName || null,
      url: `https://leetcode.com/${username}`,
      bio: profileData.profile.aboutMe || null,
      user_rank: profileData.profile.ranking || null,
      company: profileData.profile.company || null,
      school: profileData.profile.school || null,
      badges: profileData.badges?.map(b => b.name) || [],
      websites: profileData.profile.websites || [],
      skills: profileData.profile.skillTags || [],
      rep: profileData.profile.reputation || 0,
      view_count: profileData.profile.postViewCount || 0,
      active_years: profileData.userCalendar?.activeYears || [],
      streak: profileData.userCalendar?.streak || 0,
      active_days: profileData.userCalendar?.totalActiveDays || 0,
      solution_count: profileData.profile.solutionCount || 0,
      total_submitted: profileData.submitStats.totalSubmissionNum.reduce((a, b) => a + b.submissions, 0),
      total_accepted: profileData.submitStats.totalSubmissionNum.reduce((a, b) => a + b.count, 0),
      easy_submitted: profileData.submitStats.totalSubmissionNum.find(d => d.difficulty === 'Easy')?.submissions || 0,
      easy_accepted: profileData.submitStats.totalSubmissionNum.find(d => d.difficulty === 'Easy')?.count || 0,
      medium_submitted: profileData.submitStats.totalSubmissionNum.find(d => d.difficulty === 'Medium')?.submissions || 0,
      medium_accepted: profileData.submitStats.totalSubmissionNum.find(d => d.difficulty === 'Medium')?.count || 0,
      hard_submitted: profileData.submitStats.totalSubmissionNum.find(d => d.difficulty === 'Hard')?.submissions || 0,
      hard_accepted: profileData.submitStats.totalSubmissionNum.find(d => d.difficulty === 'Hard')?.count || 0,
    };

    await upsertLeetCodeProfile(userProfile);

    // === 2. LANGUAGES ===
    const langRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body: JSON.stringify({ query: languagesQuery, variables: { username } }),
    });

    const langJson = await langRes.json();
    const langData = langJson.data.matchedUser.languageProblemCount;

    const languageRecords = await Promise.all(
      langData.map(async (lang) => ({
        language_id: await doesLanguageExist(lang.languageName) || uuidv4(),
        profile_id: profileId,
        name: lang.languageName,
        solved: lang.problemsSolved,
      }))
    );

    await upsertLeetCodeLanguages(languageRecords);

    // === 3. SOLUTIONS ===
    const solRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body: JSON.stringify({
        query: solutionsQuery,
        variables: { username, orderBy: "newest_to_oldest", skip: 0, first: 15 },
      }),
    });

    const solJson = await solRes.json();
    const solEdges = solJson.data.userSolutionTopics.edges;

    const solutionsData = await Promise.all(
      solEdges.map(async ({ node }) => ({
        solution_id: await doesLeetCodeSolutionExist(profileId, node.id) || node.id,
        profile_id: profileId,
        name: node.title,
        url: node.url,
        views: node.viewCount,
        question: node.questionTitle,
        upvotes: node.post.voteCount,
      }))
    );

    await upsertLeetCodeSolutions(solutionsData);

    // === 4. SUBMISSIONS ===
    const subRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
      body: JSON.stringify({ query: recentSubmissionsQuery, variables: { username } }),
    });

    const subJson = await subRes.json();
    const submissions = subJson.data.recentSubmissionList;

    const submissionsWithDifficulty = await Promise.all(
      submissions.map(async (submission) => {
        const difficultyRes = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
          body: JSON.stringify({ query: problemDetailsQuery, variables: { titleSlug: submission.titleSlug } }),
        });

        const difficultyData = await difficultyRes.json();
        return {
          ...submission,
          difficulty: difficultyData.data?.question?.difficulty || 'Unknown',
        };
      })
    );

    const submissionRecords = await Promise.all(
      submissionsWithDifficulty.map(async (s) => {
        const createdAt = new Date(s.timestamp * 1000).toISOString().slice(0, 19).replace("T", " ");
        return {
          submissions_id: await doesLeetCodeSubmissionExist(profileId, createdAt) || uuidv4(),
          profile_id: profileId,
          problem: s.title,
          status: s.statusDisplay,
          language: s.lang,
          difficulty: s.difficulty,
          created_at: createdAt,
        };
      })
    );

    await upsertLeetCodeSubmissions(submissionRecords);

    return new Response(
      JSON.stringify({ success: true, profileId, langs: languageRecords.length, solutions: solutionsData.length, submissions: submissionRecords.length }),
      { status: 200 }
    );

  } catch (err) {
    console.error('LeetCode setup error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
