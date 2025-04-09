const create_connection = require('../connection.js');

async function getTopLanguagesByUser(userId) {
  const connection = await create_connection();

  try {
    // get all activities linked to languages
    const [rows] = await connection.query(`
      SELECT DISTINCT oa.language
      FROM users u
      JOIN sessions s ON s.user_id = u.user_id
      JOIN intervals i ON i.session_id = s.session_id
      JOIN interval_activity ia ON ia.interval_id = i.interval_id
      JOIN other_activities oa ON ia.activity_id = oa.activity_id
      WHERE u.user_id = ? AND oa.language IS NOT NULL AND oa.language != ''
    `, [userId]);

    const languages = [...new Set(rows.map(row => row.language))];

    const languageTime = {};

    // get time of each language
    for (const language of languages) {
      const [timeRows] = await connection.query(`
        SELECT
          TIMESTAMPDIFF(SECOND, i.start, i.end) AS duration_seconds
        FROM users u
        JOIN sessions s ON s.user_id = u.user_id
        JOIN intervals i ON i.session_id = s.session_id
        JOIN interval_activity ia ON ia.interval_id = i.interval_id
        JOIN other_activities oa ON ia.activity_id = oa.activity_id
        WHERE u.user_id = ? AND oa.language = ?
      `, [userId, language]);

      const totalSeconds = timeRows.reduce((sum, row) => sum + (row.duration_seconds || 0), 0);

      if (totalSeconds > 0) {
        languageTime[language] = totalSeconds;
      }
    }

    // sort top 3
    const topThree = Object.entries(languageTime)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .reduce((acc, [lang, seconds]) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        acc[lang] = `${h}h ${m}m ${s}s`;
        return acc;
      }, {});

    return topThree;

  } catch (err) {
    console.error('Error getting top languages:', err.message);
    return null;
  } finally {
    await connection.end();
  }
}

async function getTopActivitiesByUser(userId) {
  const connection = await create_connection();

  try {
    // get all activities
    const [activities] = await connection.query(`
      SELECT DISTINCT oa.activity_id, oa.name
      FROM users u
      JOIN sessions s ON s.user_id = u.user_id
      JOIN intervals i ON i.session_id = s.session_id
      JOIN interval_activity ia ON ia.interval_id = i.interval_id
      JOIN other_activities oa ON ia.activity_id = oa.activity_id
      WHERE u.user_id = ? AND oa.name IS NOT NULL AND oa.name != ''
    `, [userId]);

    const activityTime = {};

    // get total time for each activity
    for (const { activity_id, name } of activities) {
      const [timeRows] = await connection.query(`
        SELECT TIMESTAMPDIFF(SECOND, i.start, i.end) AS duration_seconds
        FROM users u
        JOIN sessions s ON s.user_id = u.user_id
        JOIN intervals i ON i.session_id = s.session_id
        JOIN interval_activity ia ON ia.interval_id = i.interval_id
        WHERE u.user_id = ? AND ia.activity_id = ?
      `, [userId, activity_id]);

      const totalSeconds = timeRows.reduce((sum, row) => sum + (row.duration_seconds || 0), 0);

      if (totalSeconds > 0) {
        activityTime[name] = totalSeconds;
      }
    }

    // get top 3 activities by time
    const topThree = Object.entries(activityTime)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .reduce((acc, [activityName, seconds]) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        acc[activityName] = `${h}h ${m}m ${s}s`;
        return acc;
      }, {});

    return topThree;

  } catch (err) {
    console.error('Error getting top activities:', err.message);
    return null;
  } finally {
    await connection.end();
  }
}

async function getUserTopStats(userId) {
  const connection = await create_connection();

  try {
    // sessions
    const [[{ sessionsTracked }]] = await connection.query(`
      SELECT COUNT(*) AS sessionsTracked
      FROM sessions
      WHERE user_id = ?
    `, [userId]);

    // intervals
    const [[{ intervalsLogged }]] = await connection.query(`
      SELECT COUNT(*) AS intervalsLogged
      FROM intervals
      WHERE session_id IN (
        SELECT session_id FROM sessions WHERE user_id = ?
      )
    `, [userId]);

    // languages
    const [[{ languagesUsed }]] = await connection.query(`
      SELECT COUNT(DISTINCT oa.language) AS languagesUsed
      FROM sessions s
      JOIN intervals i ON s.session_id = i.session_id
      JOIN interval_activity ia ON i.interval_id = ia.interval_id
      JOIN other_activities oa ON oa.activity_id = ia.activity_id
      WHERE s.user_id = ? AND oa.language IS NOT NULL AND oa.language != ''
    `, [userId]);

    // duration in hours
    const [[{ totalSeconds }]] = await connection.query(`
      SELECT SUM(TIMESTAMPDIFF(SECOND, i.start, i.end)) AS totalSeconds
      FROM sessions s
      JOIN intervals i ON s.session_id = i.session_id
      WHERE s.user_id = ?
    `, [userId]);

    const totalHours = Math.floor((totalSeconds || 0) / 3600);

    return {
      sessionsTracked,
      intervalsLogged,
      languagesUsed,
      totalHours
    };

  } catch (err) {
    console.error('Error fetching top stats:', err.message);
    return null;
  } finally {
    await connection.end();
  }
}

async function getUserProfileStats(userId) {
  const connection = await create_connection();

  try {
    // get all data in one query
    const [rows] = await connection.query(`
      SELECT
        u.first_name,
        u.last_name,
        u.username,
        u.github_username,
        gp.followers AS github_followers,
        u.leetcode_username,
        lp.view_count AS leetcode_views
      FROM users u
      LEFT JOIN github_profiles gp ON gp.user_id = u.user_id
      LEFT JOIN leetcode_profiles lp ON lp.user_id = u.user_id
      WHERE u.user_id = ?
      LIMIT 1
    `, [userId]);

    if (rows.length === 0) return null;

    const user = rows[0];

    return {
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      github: {
        username: user.github_username,
        followers: user.github_followers || 0
      },
      leetcode: {
        username: user.leetcode_username,
        views: user.leetcode_views || 0
      }
    };

  } catch (err) {
    console.error('Error fetching profile stats:', err.message);
    return null;
  } finally {
    await connection.end();
  }
}

// gets the data for each section of the left box of dashboard
export async function getCompleteUserDashboardData(userId) {
  const [profile, topLanguages, topActivities, topStats, activityTotals] = await Promise.all([
    getUserProfileStats(userId),
    getTopLanguagesByUser(userId),
    getTopActivitiesByUser(userId),
    getUserTopStats(userId),
    getUserActivityTotals(userId),
  ]);

  if (!profile || !topLanguages || !topActivities || !topStats || !activityTotals) return null;
  return {
    profile,
    topLanguages,
    topActivities,
    topStats,
    activityTotals
  };
}

// gets the data for the top right graph box
export async function getTop6ActivitiesByUser(userId) {
  const connection = await create_connection();

  try {
    const [activities] = await connection.query(`
      SELECT DISTINCT oa.activity_id, oa.name
      FROM users u
      JOIN sessions s ON s.user_id = u.user_id
      JOIN intervals i ON i.session_id = s.session_id
      JOIN interval_activity ia ON ia.interval_id = i.interval_id
      JOIN other_activities oa ON ia.activity_id = oa.activity_id
      WHERE u.user_id = ? AND oa.name IS NOT NULL AND oa.name != ''
    `, [userId]);

    const activityTime = {};

    for (const { activity_id, name } of activities) {
      const [timeRows] = await connection.query(`
        SELECT TIMESTAMPDIFF(SECOND, i.start, i.end) AS duration_seconds
        FROM users u
        JOIN sessions s ON s.user_id = u.user_id
        JOIN intervals i ON i.session_id = s.session_id
        JOIN interval_activity ia ON ia.interval_id = i.interval_id
        WHERE u.user_id = ? AND ia.activity_id = ?
      `, [userId, activity_id]);

      const totalSeconds = timeRows.reduce((sum, row) => sum + (row.duration_seconds || 0), 0);
      if (totalSeconds > 0) {
        activityTime[name] = totalSeconds;
      }
    }

    const topSix = Object.entries(activityTime)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, seconds]) => ({
        name,
        hours: (seconds / 3600).toFixed(2)
      }));

    return topSix;

  } catch (err) {
    console.error('Error getting top 6 activities:', err.message);
    return [];
  } finally {
    await connection.end();
  }
}

export async function getUserCommitDaysWithRepos(userId) {
  try {
    const connection = await create_connection();
    const query = `
      SELECT
        DATE(gc.date) AS commit_day,
        gr.name AS repo_name
      FROM github_commits gc
      JOIN github_repos gr ON gc.repo_id = gr.repo_id
      JOIN github_profiles gp ON gr.profile_id = gp.profile_id
      WHERE gp.user_id = ?
      ORDER BY commit_day DESC, repo_name ASC;
    `;

    const [rows] = await connection.query(query, [userId]);
    await connection.end();

    // group results into objects
    const grouped = {};
    for (const row of rows) {
      const { commit_day, repo_name } = row;
      if (!grouped[commit_day]) {
        grouped[commit_day] = [];
      }
      grouped[commit_day].push(repo_name);
    }

    return grouped;
  } catch (error) {
    console.error('Error fetching user commit days:', error.message);
    return {};
  }
}

export async function getUserActivityTotals(userId) {
  const connection = await create_connection();

  try {
    const results = await Promise.all([
      // github repos
      connection.query(`
        SELECT COUNT(*) AS repoCount
        FROM github_repos
        WHERE profile_id IN (
          SELECT profile_id FROM github_profiles WHERE user_id = ?
        )
      `, [userId]),

      // github commits
      connection.query(`
        SELECT COUNT(*) AS commitCount
        FROM github_commits
        WHERE repo_id IN (
          SELECT repo_id FROM github_repos
          WHERE profile_id IN (
            SELECT profile_id FROM github_profiles WHERE user_id = ?
          )
        )
      `, [userId]),

      // leetcode submissions
      connection.query(`
        SELECT total_submitted AS submissionCount
        FROM leetcode_profiles
        WHERE user_id = ?
        LIMIT 1
      `, [userId]),

      // leetcode solutions
      connection.query(`
        SELECT COUNT(*) AS solutionCount
        FROM leetcode_solutions
        WHERE profile_id IN (
          SELECT profile_id FROM leetcode_profiles WHERE user_id = ?
        )
      `, [userId]),
    ]);

    const [
      [repoRow],
      [commitRow],
      [submissionRow],
      [solutionRow],
    ] = results.map(([rows]) => rows);

    return {
      repoCount: repoRow.repoCount,
      commitCount: commitRow.commitCount,
      submissionCount: submissionRow.submissionCount,
      solutionCount: solutionRow.solutionCount,
    };
  } catch (error) {
    console.error('Error fetching user activity totals:', error.message);
    return null;
  } finally {
    await connection.end();
  }
}

export async function getLeetCodeDifficultyPie(userId) {
  const connection = await create_connection();

  try {
    const [rows] = await connection.query(
      `
      SELECT easy_accepted, medium_accepted, hard_accepted
      FROM leetcode_profiles
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) return null;

    const { easy_accepted, medium_accepted, hard_accepted } = rows[0];

    return [
      { name: "Easy", value: easy_accepted || 0 },
      { name: "Medium", value: medium_accepted || 0 },
      { name: "Hard", value: hard_accepted || 0 },
    ];
  } catch (err) {
    console.error("Error fetching LeetCode difficulty breakdown:", err.message);
    return null;
  } finally {
    await connection.end();
  }
}

export async function getGitHubMonthlyCommitLines(userId) {
  const connection = await create_connection();
  try {
    const query = `
      SELECT
        gr.name AS repo,
        DATE_FORMAT(gc.date, '%Y-%m') AS month,
        COUNT(*) AS commits
      FROM github_commits gc
      JOIN github_repos gr ON gc.repo_id = gr.repo_id
      JOIN github_profiles gp ON gr.profile_id = gp.profile_id
      WHERE gp.user_id = ?
        AND gc.date >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)
      GROUP BY gr.name, month
      ORDER BY month ASC;
    `;

    const [rows] = await connection.query(query, [userId]);

    return rows.map(row => ({
      repo: row.repo,
      month: row.month,
      commits: row.commits,
    }));
  } catch (err) {
    console.error("Error in getGitHubMonthlyCommitLines:", err.message);
    return [];
  } finally {
    await connection.end();
  }
}