const create_connection = require('../connection');

const getUserIdFromUsername = async function (username) {
    try {
        const connection = await create_connection();
        const query = `SELECT user_id FROM users WHERE username = ?`
        const [rows] = await connection.query(query, [username]);
        await connection.end();
        return rows[0].user_id;
    } catch (err) {
        console.error('Username doesnt exist', err.message);
        throw err;
    }
}

async function upsert_github_username(userId, github_username) {
    try {
        const connection = await create_connection();

        const query = `UPDATE users SET github_username = ? WHERE user_id = ?`;
        const values = [github_username, userId];

        const [res] = await connection.query(query, values);
        console.log('GitHub username updated successfully:', res);

        await connection.end();
        return { updated: true, message: 'GitHub username updated successfully' };
    } catch (err) {
        console.error('Error updating GitHub username:', err.message);
        throw err;
    }
}

async function upsert_leetcode_username(userId, leetcode_username) {
    try {
        const connection = await create_connection();

        const query = `UPDATE users SET leetcode_username = ? WHERE user_id = ?`;
        const values = [leetcode_username, userId];

        const [res] = await connection.query(query, values);
        console.log('LeetCode username updated successfully:', res);

        await connection.end();
        return { updated: true, message: 'LeetCode username updated successfully' };
    } catch (err) {
        console.error('Error updating LeetCode username:', err.message);
        throw err;
    }
}

const upsert_external_usernames = async function (userId, leetcode_username, github_username) {
    try {
        if (github_username) {
            await upsert_github_username(userId, github_username);
        }

        if (leetcode_username) {
            await upsert_leetcode_username(userId, leetcode_username);
        }

        return { updated: true, message: 'Usernames updated successfully' };
    } catch (err) {
        console.error('Error updating usernames:', err.message);
        throw err;
    }
};


module.exports = {
    upsert_external_usernames,
    getUserIdFromUsername
}