const create_connection = require('../connection');
const { v4: uuidv4 } = require('uuid');

const insertSession = async function (session) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO sessions (session_id, user_id, start, end)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            uuidv4(),
            session.user_id,
            session.start || null,
            session.end || null
        ];
        await connection.query(query, values);
        console.log('Session inserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error inserting session:', error.message);
    }
};

const insertInterval = async function (interval) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO intervals (interval_id, session_id, start, end)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            uuidv4(),
            interval.session_id,
            interval.start || null,
            interval.end || null
        ];
        await connection.query(query, values);
        console.log('Interval inserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error inserting interval:', error.message);
    }
}

const createActivity = async function (activity) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO other_activities (activity_id, name, type, description, public, upvotes)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            uuidv4(),
            activity.name,
            activity.type || null,
            activity.description || null,
            activity.public,
            activity.upvotes
        ];
        await connection.query(query, values);
        console.log('Activity created successfully');
        await connection.end();
    } catch (error) {
        console.error('Error creating activity:', error.message);
    }
}

const upvoteActivity = async function (activity_id) {
    try {
        const connection = await create_connection();
        const query = `
            UPDATE other_activities
            SET upvotes = upvotes + 1
            WHERE activity_id = ?
        `;
        const [res] = await connection.query(query, [activity_id]);

        if (res.affectedRows > 0) {
            console.log(`Upvote added successfully for activity: ${activity_id}`);
        } else {
            console.log(`Activity with ID ${activity_id} not found.`);
        }

        await connection.end();
    } catch (error) {
        console.error('Error upvoting activity:', error.message);
    }
};


const insertActivity = async function (activity) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO intervalActivity (interval_activity_id, interval_id, commit_id, solution_id, activity_id, submission_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            uuidv4(),
            activity.interval_id,
            activity.commit_id || null,
            activity.solution_id || null,
            activity.activity_id || null,
            activity.submission_id || null,
        ];
        await connection.query(query, values);
        console.log('Activity inserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error inserting activity:', error.message);
    }
}

module.exports = {
    insertSession,
    insertInterval,
    insertActivity,
    createActivity,
    upvoteActivity
}

