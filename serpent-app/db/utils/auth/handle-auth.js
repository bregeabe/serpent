const create_connection = require('../connection');
const { handle_name, generate_unique_username} = require('../helpers/handle-name');
const handle_google_username = require('../helpers/handle-google-username');
const { does_user_exist, does_email_exist } = require('../helpers/handle-login');
const { hash_password, verify_password} = require('../helpers/handle-password')
import {v4 as uuidv4} from 'uuid';
//TODO: username is made by email, handle if a username is the same as an already existing one in the database, i.e. if abrege11@gmail.com signs up but abrege11 is already a user, we add a 1 to the end, then a 2, and so on.

const handle_google_auth = async function (name, email, google_id) {
    const [first_name, last_name] = handle_name(name)
    const username = handle_google_username(email)
    if (await does_user_exist(username)) {
        username = await generate_unique_username(username, connection)
    }
    try {
        const connection = await create_connection();
        const query = `INSERT INTO users (
            user_id, google_id, first_name, last_name, email, username
        ) VALUES (?, ?, ?, ?, ?, ?)`
        const values = [
            uuidv4(),
            google_id,
            first_name,
            last_name,
            email,
            username
        ]
        const [res] = await connection.query(query, values)
        console.log('User inserted successfully:', res);
        await connection.end();
    } catch (err) {
        console.error('error creating user with google auth: ', err.message)
    }
}

const handle_signup = async function (user) {
    try {
        const connection = await create_connection();
        const isDuplicate = await does_email_exist(user.email);
        if (isDuplicate) {
            return {created: false, message: "email already exists"};
        }
        if (await does_user_exist(user.username)) {
            user.username = await generate_unique_username(user.username, connection)
        }
        const query = `INSERT INTO users (
            user_id, first_name, last_name, email, username, password
        ) VALUES (?, ?, ?, ?, ?, ?)`
        const password = await hash_password(user.password)
        const values = [
            uuidv4(),
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
        const query = `SELECT email, password FROM users WHERE email = ?`
        const [rows] = await connection.query(query, [username])
        await connection.end();

        if (rows.length === 0) {
            return { authenticated: false, message: 'User not found'};
        }

        const currentPasswordHash = rows[0].password;

        if (!currentPasswordHash) {
            return { authenticated: false, message: 'Please sign in with Google' }
        }

        const isPasswordValid = await verify_password(password, currentPasswordHash)

        if (isPasswordValid) {
            return { authenticated: true, message: 'Authentication successful' };
        } else {
            return { authenticated: false, message: 'Invalid password' };
        }
    } catch (err) {
        console.error('authentication error', err.message);
        throw err;
    }
}

module.exports = {
    handle_google_auth,
    handle_signup,
    handle_vanilla_login
};