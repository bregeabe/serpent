const create_connection = require('../connection');
const { does_user_exist, does_email_exist } = require('../helpers/handle-login');
const { hash_password, verify_password} = require('../helpers/handle-password');
import {v4 as uuidv4} from 'uuid';
import jwt from 'jsonwebtoken'

const handle_signup = async function (user) {
    try {
        const connection = await create_connection();
        const isDuplicate = await does_email_exist(user.email);
        if (isDuplicate) {
            return {created: false, message: "email already exists"};
        }
        const query = `INSERT INTO users (
            user_id, first_name, last_name, email, username, password
        ) VALUES (?, ?, ?, ?, ?, ?)`
        const password = await hash_password(user.password)
        const values = [
            process.env.USER_ID,
            user.first_name,
            user.last_name,
            user.email,
            user.username,
            password
        ]
        const [res] = await connection.query(query, values)
        console.log('User inserted successfully:', res);
        await connection.end();
        return {created: true, message: 'user created successfully'};
    } catch (err) {
        console.error('error creating user with signup: ', err.message)
        throw err;
    }
}

const handle_vanilla_login = async function (username, password) {
    try {
        const connection = await create_connection();
        const query = `SELECT user_id, email, password FROM users WHERE email = ?`;
        const [rows] = await connection.query(query, [username])
        await connection.end();

        if (rows.length === 0) {
            return { authenticated: false, message: 'User not found'};
        }

        const currentPasswordHash = rows[0].password;
        const userId = rows[0].user_id;

        if (!currentPasswordHash) {
            return { authenticated: false, message: 'Please sign in with Google' }
        }

        const isPasswordValid = await verify_password(password, currentPasswordHash)

        if (!isPasswordValid) {
            return { authenticated: false, message: 'Invalid password' };
        }
        return { authenticated: true, message: 'Authentication successful' };

    } catch (err) {
        console.error('authentication error', err.message);
        throw err;
    }
}

module.exports = {
    handle_signup,
    handle_vanilla_login
};