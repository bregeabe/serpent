const create_connection = require('../connection');

async function does_user_exist(username) {
    try {
        const connection = await create_connection();
        const query = `SELECT username FROM users WHERE username = ?`;
        const [rows] = await connection.query(query, [username]);
        await connection.end();
        return rows.length > 0;

    } catch (err) {
        console.error('Error checking user existence:', err.message);
        throw err;
    }
}

async function auth(username, passwordHash) {
    try {
        const connection = await create_connection();
        const query = `SELECT username FROM users WHERE username = ?`;
        const [rows] = await connection.query(query, [username]);

        await connection.end();

        if (rows.length > 0) {
            console.log('User exists:', rows[0].username);
            return true;
        } else {
            console.log('User does not exist');
            return false;
        }
    } catch (err) {
        console.error('Error checking user existence:', err.message);
        throw err;
    }
}

module.exports = {
    does_user_exist,
    auth,
}
