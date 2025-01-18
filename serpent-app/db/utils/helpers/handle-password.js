const argon2 = require('argon2');

async function hash_password(password) {
    try {
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err.message);
        throw err;
    }
}

async function verify_password(password, hashedPassword) {
    try {
        return await argon2.verify(hashedPassword, password);
    } catch (err) {
        console.error('Error verifying password:', err.message);
        throw err;
    }
}

module.exports = {
    hash_password,
    verify_password,
};
