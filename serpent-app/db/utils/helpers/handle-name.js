const create_connection = require('../connection');

function handle_name(name) {
    if (name.includes(" ")) {
        return name.split(" ");
    } else {
        return [name, null]
    }
}

async function generate_unique_username(username, connection) {
    let baseUsername = username;
    let count = 1;

    while (true) {
        const query = `SELECT username FROM users WHERE username = ?`;
        const [rows] = await connection.query(query, [username]);
        if (rows.length === 0) {
            break;
        }
        username = `${baseUsername}${count}`;
        count++;
    }
    return username;
}


module.exports = {
    handle_name,
    generate_unique_username
}