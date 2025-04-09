import { create_connection } from "../connection";
import { v4 as uuidv4 } from "uuid";

// nasty format helpers
function formatDatetimeForMySQL(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  const hours = `${d.getHours()}`.padStart(2, "0");
  const minutes = `${d.getMinutes()}`.padStart(2, "0");
  const seconds = `${d.getSeconds()}`.padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function formatDuration(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatDateToYMD(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ensureSeconds(timeStr) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  return `${timeStr}:00`;
}

// get users last 10 github commits
export async function getRecentCommitsByUser(userId) {
  const connection = await create_connection();

  try {
    const [rows] = await connection.query(`
      SELECT
        gc.message,
        gc.date,
        gr.name AS repo
      FROM github_commits gc
      JOIN github_repos gr ON gc.repo_id = gr.repo_id
      JOIN github_profiles gp ON gr.profile_id = gp.profile_id
      WHERE gp.user_id = ?
      ORDER BY gc.date DESC
      LIMIT 10
    `, [userId]);

    return rows.map((row) => ({
      message: row.message,
      date: new Date(row.date).toLocaleDateString("en-US"),
      repo: row.repo,
    }));
  } catch (err) {
    console.error("Error fetching recent commits:", err.message);
    return [];
  } finally {
    await connection.end();
  }
};

// ugly session duration helper
export async function getRecentSessionsWithDuration(userId, limit = 10) {
  const connection = await create_connection();

  try {
    const [rows] = await connection.query(`
      SELECT
        s.session_id,
        DATE(s.start) AS date,
        TIMESTAMPDIFF(SECOND, s.start, s.end) AS duration_seconds
      FROM sessions s
      WHERE s.user_id = ?
        AND s.start IS NOT NULL AND s.end IS NOT NULL
      ORDER BY s.start DESC
      LIMIT ?
    `, [userId, limit]);

    return rows.map(row => {
      const hours = Math.floor(row.duration_seconds / 3600);
      const minutes = Math.floor((row.duration_seconds % 3600) / 60);
      const seconds = row.duration_seconds % 60;

      const formattedDate = new Date(row.date).toISOString().split("T")[0];
      const formattedDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      return {
        id: row.session_id,
        date: formattedDate,
        duration: formattedDuration,
      };
    });

  } catch (err) {
    console.error("Error fetching recent sessions:", err.message);
    return [];
  } finally {
    await connection.end();
  }
}

// get the users activities and their recent leetcode submissions for 'whatre you working on' list
export async function getRecentMixedActivity(userId, limit = 15) {
  const connection = await create_connection();

  try {
    const [allActivities] = await connection.query(
      `SELECT name AS label, type, description, language
       FROM other_activities`
    );

    const allFormatted = allActivities.map((act) => ({
      type: act.type,
      label: act.label,
      date: null,
      extra: act.description || act.type,
    }));

    const [submissions] = await connection.query(
      `SELECT ls.problem AS label, ls.created_at AS date, ls.language AS extra
       FROM leetcode_submissions ls
       JOIN leetcode_profiles lp ON ls.profile_id = lp.profile_id
       WHERE lp.user_id = ?
       ORDER BY ls.created_at DESC
       LIMIT ?`,
      [userId, limit]
    );

    const leetcodeMapped = submissions.map((sub) => ({
      type: "leetcode",
      label: `${sub.label} (${sub.extra})`,
      date: new Date(sub.date).toISOString().split("T")[0],
      extra: "Leetcode",
    }));

    return [...allFormatted, ...leetcodeMapped];
  } catch (err) {
    console.error("Error fetching recent mixed activity:", err.message);
    return [];
  } finally {
    await connection.end();
  }
}

// get all intervals, activities and other activities from a session
export async function getSessionDetails(sessionId) {
  const connection = await create_connection();

  try {
    const [sessionRows] = await connection.query(
      `
      SELECT user_id, DATE_FORMAT(start, '%Y-%m-%d') AS date, TIMESTAMPDIFF(SECOND, start, end) AS duration_seconds
      FROM sessions
      WHERE session_id = ?
    `,
      [sessionId]
    );

    if (sessionRows.length === 0) {
      return {
        session: null,
        intervals: [],
        activities: [],
        availableActivities: [],
      };
    }
    const userId = sessionRows[0].user_id;

    const session = {
      id: sessionId,
      date: sessionRows[0].date,
      duration: formatDuration(sessionRows[0].duration_seconds),
    };

    // get intervals of the session
    const [intervalRows] = await connection.query(
      `
      SELECT
        i.interval_id,
        TIME(i.start) AS start_time,
        TIME(i.end) AS end_time,
        TIMESTAMPDIFF(SECOND, i.start, i.end) AS duration_seconds
      FROM intervals i
      WHERE i.session_id = ?
    `,
      [sessionId]
    );

    const intervals = intervalRows.map((int) => ({
      interval_id: int.interval_id,
      start: int.start_time,
      end: int.end_time,
      duration: formatDuration(int.duration_seconds),
    }));

    const intervalIds = intervalRows.map((i) => i.interval_id);

    // get activities linked to intervals if there
    let activities = [];
    if (intervalIds.length > 0) {
      const [activityRows] = await connection.query(
        `
        SELECT ia.interval_id, ia.activity_id, oa.name AS activity_name
        FROM interval_activity ia
        JOIN other_activities oa ON ia.activity_id = oa.activity_id
        WHERE ia.interval_id IN (?)
      `,
        [intervalIds]
      );

      activities = Array.isArray(activityRows)
        ? activityRows.map((row) => ({
            interval_id: row.interval_id,
            activity_id: row.activity_id,
            activity_name: row.activity_name,
          }))
        : [];
    }

    // for editing dropdown to change activity
    const [availableActivitiesRows] = await connection.query(
      `
      SELECT DISTINCT oa.activity_id, oa.name
      FROM other_activities oa
      JOIN interval_activity ia ON oa.activity_id = ia.activity_id
      JOIN intervals i ON i.interval_id = ia.interval_id
      JOIN sessions s ON s.session_id = i.session_id
      WHERE s.user_id = ?
      `,
      [userId]
    );

    const availableActivities = availableActivitiesRows.map((row) => ({
      activity_id: row.activity_id,
      name: row.name,
    }));

    return {
      session,
      intervals,
      activities,
      availableActivities,
    };
  } catch (err) {
    console.error("Error in getSessionDetails:", err.message);
    return {
      session: null,
      intervals: [],
      activities: [],
      availableActivities: [],
    };
  } finally {
    await connection.end();
  }
}

export async function updateSessionIntervalsAndActivities(sessionId, intervals, activities) {
  const connection = await create_connection();
  try {
    await connection.beginTransaction();

    // fetch at format session date
    const [[sessionDateRow]] = await connection.query(
      `SELECT DATE(start) AS session_date FROM sessions WHERE session_id = ?`,
      [sessionId]
    );
    const sessionDate = formatDateToYMD(sessionDateRow.session_date);

    // update interval timestamps
    for (const interval of intervals) {
      const startDatetime = `${sessionDate} ${ensureSeconds(interval.start)}`;
      const endDatetime = `${sessionDate} ${ensureSeconds(interval.end)}`;

      await connection.query(
        `
        UPDATE intervals
        SET start = ?, end = ?
        WHERE interval_id = ? AND session_id = ?
        `,
        [startDatetime, endDatetime, interval.interval_id, sessionId]
      );
    }

    // update associated activities
    for (const act of activities) {
      if (!act.activity_id) continue;

      await connection.query(
        `
        UPDATE interval_activity
        SET activity_id = ?
        WHERE interval_id = ?
        `,
        [act.activity_id, act.interval_id]
      );
    }

    // recalculate duration, get earliest start and latest end
    const [minMaxRows] = await connection.query(
      `
      SELECT
        MIN(start) AS min_start,
        MAX(end) AS max_end
      FROM intervals
      WHERE session_id = ?
      `,
      [sessionId]
    );

    const { min_start, max_end } = minMaxRows[0];

    // update if new min or max is found
    if (min_start && max_end) {
      await connection.query(
        `
        UPDATE sessions
        SET start = ?, end = ?
        WHERE session_id = ?
        `,
        [min_start, max_end, sessionId]
      );
    }

    await connection.commit();
    return { success: true };
  } catch (err) {
    console.error("Error updating session intervals and activities:", err.message);
    await connection.rollback();
    return { success: false, error: err.message };
  } finally {
    await connection.end();
  }
}

// export async function getUserActivities() {
//   const connection = await create_connection();
//   try {
//     const [rows] = await connection.query(`
//       SELECT activity_id, name AS activity_name, description, type
//       FROM other_activities
//       ORDER BY name ASC
//     `);
//     return rows;
//   } catch (err) {
//     console.error("Error fetching activities:", err.message);
//     return [];
//   } finally {
//     await connection.end();
//   }
// }

// insert a new session
export async function saveNewSessionWithIntervals(userId, intervals) {
  const connection = await create_connection();

  try {
    if (!userId || !Array.isArray(intervals) || intervals.length === 0) {
      return { success: false, error: "Invalid input" };
    }

    await connection.beginTransaction();

    const sessionId = uuidv4();
    const startTimestamps = intervals.map(i => new Date(i.start).getTime());
    const endTimestamps = intervals.map(i => new Date(i.end).getTime());

    const sessionStart = formatDatetimeForMySQL(new Date(Math.min(...startTimestamps)));
    const sessionEnd = formatDatetimeForMySQL(new Date(Math.max(...endTimestamps)));

    // insert session
    await connection.query(
      `INSERT INTO sessions (session_id, user_id, start, end) VALUES (?, ?, ?, ?)`,
      [sessionId, userId, sessionStart, sessionEnd]
    );

    // insert intervals for the session
    for (const interval of intervals) {
      const intervalId = uuidv4();
      const formattedStart = formatDatetimeForMySQL(new Date(interval.start));
      const formattedEnd = formatDatetimeForMySQL(new Date(interval.end));

      await connection.query(
        `INSERT INTO intervals (interval_id, session_id, start, end)
          VALUES (?, ?, ?, ?)`,
        [intervalId, sessionId, formattedStart, formattedEnd]
      );

      // insert interval activities
      const { activity_id } = await getActivityIdFromLabel(connection, interval.activity);

      await connection.query(
        `INSERT INTO interval_activity (interval_activity_id, interval_id, activity_id)
          VALUES (?, ?, ?)`,
        [uuidv4(), intervalId, activity_id]
      );
    }

    await connection.commit();
    return { success: true, sessionId };

  } catch (err) {
    console.error("Error in saveNewSessionWithIntervals:", err.message);
    await connection.rollback();
    return { success: false, error: err.message };
  } finally {
    await connection.end();
  }
}

// convert leetcode submission to activity or just get the activity passed
async function getActivityIdFromLabel(connection, label) {
  if (label.toLowerCase().includes("leetcode")) {
    const [leetcodeActivity] = await connection.query(
      `SELECT activity_id FROM other_activities WHERE name = 'Leetcode' LIMIT 1`
    );

    if (leetcodeActivity.length > 0) {
      return { activity_id: leetcodeActivity[0].activity_id, type: "leetcode" };
    } else {
      throw new Error("Missing 'Leetcode' activity in database.");
    }
  }

  const [actRows] = await connection.query(
    `SELECT activity_id
      FROM other_activities
      WHERE name = ?
      LIMIT 1`,
    [label]
  );

  if (actRows.length > 0) {
    return { activity_id: actRows[0].activity_id, type: "manual" };
  }

  throw new Error(`Activity not found for label: ${label}`);
}

export async function getAllActivities() {
  const connection = await create_connection();
  try {
    const [rows] = await connection.query(`SELECT * FROM other_activities`);
    return rows;
  } catch (err) {
    console.error("Error fetching activities:", err.message);
    return [];
  } finally {
    await connection.end();
  }
}

export async function createActivity(name, description = "", language) {
  const connection = await create_connection();

  try {
    const activity_id = uuidv4();

    await connection.query(
      `INSERT INTO other_activities (activity_id, name, description, language, type, public)
       VALUES (?, ?, ?, ?, 'manual', false)`,
      [activity_id, name, description, language]
    );

    return { success: true, activity_id };
  } catch (err) {
    console.error("Error creating activity:", err.message);
    return { success: false, error: err.message };
  } finally {
    await connection.end();
  }
}


export async function updateActivity(activity_id, { name, description = "", language = "" }) {
  const connection = await create_connection();

  try {
    await connection.query(
      `UPDATE other_activities SET name = ?, description = ?, language = ? WHERE activity_id = ?`,
      [name, description, language, activity_id]
    );

    return { success: true };
  } catch (err) {
    console.error("Error updating activity:", err.message);
    return { success: false, error: err.message };
  } finally {
    await connection.end();
  }
}

export async function deleteActivity(activity_id) {
  const connection = await create_connection();
  try {
    await connection.query(
      `DELETE FROM other_activities WHERE activity_id = ?`,
      [activity_id]
    );
    return { success: true };
  } catch (err) {
    console.error("Error deleting activity:", err.message);
    return { success: false, error: err.message };
  } finally {
    await connection.end();
  }
}
