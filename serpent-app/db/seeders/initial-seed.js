const create_connection = require('../utils/connection');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
    const connection = await create_connection();

    try {
        console.log('\nseeding users...');
        const user_id = uuidv4();
        await connection.query(`
            INSERT INTO users (user_id, email, first_name, last_name, username, password, github_username, leetcode_username, created_at)
            VALUES ('${user_id}', 'abeabebrege@gmail.com', 'Abe', 'Brege', 'imabe', 'password123', 'abrege11', 'abrege11', NOW());
        `);

        console.log('seeding sessions...');
        const session_id = uuidv4();
        await connection.query(`
            INSERT INTO sessions (session_id, user_id, start, end, created_at)
            VALUES ('${session_id}', '${user_id}', '2025-02-01 12:00:00', '2025-02-01 12:00:00', NOW());
        `);

        console.log('seeding intervals...');
        const interval_id = uuidv4();
        await connection.query(`
            INSERT INTO intervals (interval_id, session_id, start, end, created_at)
            VALUES ('${interval_id}', '${session_id}', '2025-02-01 12:00:00', '2025-02-01 12:00:00', NOW());
        `);

        console.log('seeding activities...');
        const activity_id = uuidv4();
        await connection.query(`
            INSERT INTO other_activities (activity_id, name, type, description, public, upvotes, created_at)
            VALUES ('${activity_id}', 'Calculus III', 'Homework', 'Northern Michigan University Calculus 3', true, 0, NOW());
        `);

        console.log('seeding interval activities...');
        const interval_activity_id = uuidv4();
        await connection.query(`
            INSERT INTO interval_activity (interval_activity_id, interval_id, commit_id, solution_id, activity_id, submission_id, created_at)
            VALUES ('${interval_activity_id}', '${interval_id}', NULL, NULL, NULL, NULL, NOW());
        `);

        console.log('upvoting activity...');
        await connection.query(`
            UPDATE other_activities
            SET upvotes = upvotes + 1
            WHERE activity_id = '666d2a3b-7dd6-42b0-b234-ede2d831aa7f';
        `);

        console.log('\nDatabase Seeding Complete!\n');
    } catch (error) {
        console.error('\nError seeding database:', error.message);
    } finally {
        await connection.end();
    }
}

// Execute the seeding function
seedDatabase();
