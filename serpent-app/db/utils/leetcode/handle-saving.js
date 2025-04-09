import { create_connection } from '../connection';
const { v4: uuidv4 } = require('uuid');

export const getProfileIdFromUserId = async function (userId) {
    try {
        const connection = await create_connection();
        const query = `SELECT profile_id FROM leetcode_profiles WHERE user_id = ? LIMIT 1`;
        const [rows] = await connection.query(query, [userId]);

        await connection.end();
        return rows.length > 0 ? rows[0].profile_id : null;
    } catch (error) {
        console.error('Error getting profile id', error.message);
        return null;
    }
};

export const doesLanguageExist = async function (languageName) {
    try {
        const connection = await create_connection();
        const query = `SELECT language_id FROM leetcode_languages WHERE name = ? LIMIT 1`;
        const [rows] = await connection.query(query, [languageName]);

        await connection.end();
        return rows.length > 0 ? rows[0].language_id : null;
    } catch (error) {
        console.error('Error getting profile id', error.message);
        return null;
    }
};


export const upsertLeetCodeProfile = async (profileData) => {
    try {
        const connection = await create_connection();

        const query = `
            INSERT INTO leetcode_profiles (
                profile_id, user_id, username, name, url, bio, user_rank, company,
                school, badges, websites, skills, rep, view_count, active_years,
                streak, active_days, solution_count, total_submitted, total_accepted,
                easy_submitted, easy_accepted, medium_submitted, medium_accepted,
                hard_submitted, hard_accepted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                url = VALUES(url),
                bio = VALUES(bio),
                user_rank = VALUES(user_rank),
                company = VALUES(company),
                school = VALUES(school),
                badges = VALUES(badges),
                websites = VALUES(websites),
                skills = VALUES(skills),
                rep = VALUES(rep),
                view_count = VALUES(view_count),
                active_years = VALUES(active_years),
                streak = VALUES(streak),
                active_days = VALUES(active_days),
                solution_count = VALUES(solution_count),
                total_submitted = VALUES(total_submitted),
                total_accepted = VALUES(total_accepted),
                easy_submitted = VALUES(easy_submitted),
                easy_accepted = VALUES(easy_accepted),
                medium_submitted = VALUES(medium_submitted),
                medium_accepted = VALUES(medium_accepted),
                hard_submitted = VALUES(hard_submitted),
                hard_accepted = VALUES(hard_accepted)
        `;

        const values = [
            profileData.profile_id || uuidv4(),
            profileData.user_id,
            profileData.username,
            profileData.name || null,
            profileData.url || null,
            profileData.bio || null,
            profileData.user_rank || null,
            profileData.company || null,
            profileData.school || null,
            JSON.stringify(profileData.badges || []),
            JSON.stringify(profileData.websites || []),
            JSON.stringify(profileData.skills || []),
            profileData.rep || 0,
            profileData.view_count || 0,
            JSON.stringify(profileData.active_years || []),
            profileData.streak || 0,
            profileData.active_days || 0,
            profileData.solution_count || 0,
            profileData.total_submitted || 0,
            profileData.total_accepted || 0,
            profileData.easy_submitted || 0,
            profileData.easy_accepted || 0,
            profileData.medium_submitted || 0,
            profileData.medium_accepted || 0,
            profileData.hard_submitted || 0,
            profileData.hard_accepted || 0
        ];

        await connection.query(query, values);
        console.log('LeetCode profile upserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error upserting LeetCode profile:', error.message);
    }
};

export const upsertLeetCodeLanguages = async (languagesData) => {
    try {
        const connection = await create_connection();

        const query = `
            INSERT INTO leetcode_languages (
                language_id, profile_id, name, solved
            ) VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                solved = VALUES(solved)
        `;

        for (const language of languagesData) {
            const values = [
                language.language_id || uuidv4(),
                language.profile_id,
                language.name,
                language.solved
            ];
            await connection.query(query, values);
        }

        console.log('LeetCode languages upserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error upserting LeetCode languages:', error.message);
    }
};

export const upsertLeetCodeSubmissions = async (submissionsData) => {
    try {
        const connection = await create_connection();

        const query = `
            INSERT INTO leetcode_submissions (
                submissions_id, profile_id, problem, status, language, difficulty, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                status = VALUES(status),
                language = VALUES(language),
                difficulty = VALUES(difficulty)
        `;

        for (const submission of submissionsData) {
            const values = [
                submission.submissions_id || uuidv4(),
                submission.profile_id,
                submission.problem,
                submission.status,
                submission.language,
                submission.difficulty,
                submission.created_at
            ];
            await connection.query(query, values);
        }

        console.log('LeetCode submissions upserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error upserting LeetCode submissions:', error.message);
    }
};

export const doesLeetCodeSubmissionExist = async (profileId, timestamp) => {
    try {
        const connection = await create_connection();
        const query = `SELECT submissions_id FROM leetcode_submissions WHERE profile_id = ? AND created_at = ? LIMIT 1`;
        const [rows] = await connection.query(query, [profileId, timestamp]);

        await connection.end();
        return rows.length > 0 ? rows[0].submissions_id : null;
    } catch (error) {
        console.error('Error checking submission existence:', error.message);
        return null;
    }
};

export const upsertLeetCodeSolutions = async (solutionsData) => {
    try {
        const connection = await create_connection();

        const query = `
            INSERT INTO leetcode_solutions (
                solution_id, profile_id, name, url, views, question, upvotes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                views = VALUES(views),
                upvotes = VALUES(upvotes)
        `;

        for (const solution of solutionsData) {
            const values = [
                solution.solution_id,
                solution.profile_id,
                solution.name,
                solution.url,
                solution.views,
                solution.question,
                solution.upvotes
            ];
            await connection.query(query, values);
        }

        console.log('LeetCode solutions upserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error upserting LeetCode solutions:', error.message);
    }
};


export const doesLeetCodeSolutionExist = async (profileId, solutionId) => {
    try {
        const connection = await create_connection();
        const query = `SELECT solution_id FROM leetcode_solutions WHERE profile_id = ? AND solution_id = ? LIMIT 1`;
        const [rows] = await connection.query(query, [profileId, solutionId]);

        await connection.end();
        return rows.length > 0 ? rows[0].solution_id : null;
    } catch (error) {
        console.error('Error checking solution existence:', error.message);
        return null;
    }
};
