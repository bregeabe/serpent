const create_connection = require('../connection');

const does_user_exist = async function (username) {
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

const does_email_exist = async function (email) {
    try {
        const connection = await create_connection();
        const query = `SELECT email FROM users WHERE email = ?`;
        const [rows] = await connection.query(query, [email]);
        await connection.end();
        return rows.length > 0;

    } catch (err) {
        console.error('Error checking user existence:', err.message);
        throw err;
    }
}

module.exports = {
    does_user_exist,
    does_email_exist,
}
