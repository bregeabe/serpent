const create_connection = require('../connection');
const { v4: uuidv4 } = require('uuid');

const upsertSession = async function (session) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO sessions (session_id, user_id, start, end)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            start = VALUES(start),
            end = VALUES(end);
        `;
        const values = [
            session.session_id || uuidv4(),
            session.user_id,
            session.start || null,
            session.end || null
        ];
        await connection.query(query, values);
        console.log('Session upserted successfully');
        await connection.end();
    } catch (error) {
        console.error('Error upserting session:', error.message);
    }
};

const upsertInterval = async function (interval) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO intervals (interval_id, session_id, start, end)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            session_id = VALUES(session_id),
            start = VALUES(start),
            end = VALUES(end);
        `;
        const values = [
            interval.interval_id || uuidv4(),
            interval.session_id,
            interval.start || null,
            interval.end || null
        ];
        await connection.query(query, values);
        console.log('Interval upserted successfully');
        await connection.end();
        return new Response(JSON.stringify({ message: 'Interval upserted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error upserting interval:', error.message);
        return new Response(JSON.stringify({ message: 'Issue upserting interval' }), { status: 400 });
    }
};

const upsertActivity = async function (activity) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO other_activities (activity_id, name, type, description, public, upvotes)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            type = VALUES(type),
            description = VALUES(description),
            public = VALUES(public),
            upvotes = VALUES(upvotes);
        `;
        const values = [
            activity.activity_id || uuidv4(),
            activity.name,
            activity.type || null,
            activity.description || null,
            activity.public,
            activity.upvotes
        ];
        await connection.query(query, values);
        console.log('Activity upserted successfully');
        await connection.end();
        return new Response(JSON.stringify({ message: 'Activity created successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error upserting activity:', error.message);
        return new Response(JSON.stringify({ message: 'Issue creating activity' }), { status: 400 });
    }
};

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
        return new Response(JSON.stringify({ message: 'Activity upvoted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error upvoting activity:', error.message);
        return new Response(JSON.stringify({ message: 'Issue upvoting activity' }), { status: 400 });
    }
};


const upsertIntervalActivity = async function (activity) {
    try {
        const connection = await create_connection();
        const query = `
            INSERT INTO interval_activity (interval_activity_id, interval_id, commit_id, solution_id, activity_id, submission_id)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            interval_id = VALUES(interval_id),
            commit_id = VALUES(commit_id),
            solution_id = VALUES(solution_id),
            activity_id = VALUES(activity_id),
            submission_id = VALUES(submission_id);
        `;
        const values = [
            activity.interval_activity_id || uuidv4(),
            activity.interval_id,
            activity.commit_id || null,
            activity.solution_id || null,
            activity.activity_id || null,
            activity.submission_id || null,
        ];
        await connection.query(query, values);
        console.log('Interval activity upserted successfully');
        await connection.end();
        return new Response(JSON.stringify({ message: 'Activity upserted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error upserting interval activity:', error.message);
        return new Response(JSON.stringify({ message: 'Issue upserting interval activity' }), { status: 400 });
    }
};

const deleteSession = async function (session_id) {
    try {
        const connection = await create_connection();
        const query = `DELETE FROM sessions WHERE session_id = ?`;
        const [res] = await connection.query(query, [session_id]);

        if (res.affectedRows > 0) {
            console.log(`Session with ID ${session_id} deleted successfully`);
        } else {
            console.log(`Session with ID ${session_id} not found.`);
        }

        await connection.end();
        return new Response(JSON.stringify({ message: 'Session deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting session:', error.message);
        return new Response(JSON.stringify({ message: 'Issue deleting session' }), { status: 400 });
    }
};

const deleteInterval = async function (interval_id) {
    try {
        const connection = await create_connection();
        const query = `DELETE FROM intervals WHERE interval_id = ?`;
        const [res] = await connection.query(query, [interval_id]);

        if (res.affectedRows > 0) {
            console.log(`Interval with ID ${interval_id} deleted successfully`);
        } else {
            console.log(`Interval with ID ${interval_id} not found.`);
        }

        await connection.end();
        return new Response(JSON.stringify({ message: 'Interval deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting interval:', error.message);
        return new Response(JSON.stringify({ message: 'Issue deleting interval' }), { status: 400 });
    }
};

const deleteActivity = async function (activity_id) {
    try {
        const connection = await create_connection();
        const query = `DELETE FROM other_activities WHERE activity_id = ?`;
        const [res] = await connection.query(query, [activity_id]);

        if (res.affectedRows > 0) {
            console.log(`Activity with ID ${activity_id} deleted successfully`);
        } else {
            console.log(`Activity with ID ${activity_id} not found.`);
        }
        await connection.end();
        return new Response(JSON.stringify({ message: 'Activity deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting activity:', error.message);
        return new Response(JSON.stringify({ message: 'Issue deleting activity' }), { status: 400 });
    }
};

const deleteIntervalActivity = async function (interval_activity_id) {
    try {
        const connection = await create_connection();
        const query = `DELETE FROM interval_activity WHERE interval_activity_id = ?`;
        const [res] = await connection.query(query, [interval_activity_id]);

        if (res.affectedRows > 0) {
            console.log(`Interval activity with ID ${interval_activity_id} deleted successfully`);
        } else {
            console.log(`Interval activity with ID ${interval_activity_id} not found.`);
        }

        await connection.end();
        return new Response(JSON.stringify({ message: 'Interval activity deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error deleting interval activity:', error.message);
        return new Response(JSON.stringify({ message: 'issue deleting interval activity' }), { status: 400 });
    }
};


module.exports = {
    upsertSession,
    upsertInterval,
    upsertIntervalActivity,
    upsertActivity,
    upvoteActivity,
    deleteSession,
    deleteInterval,
    deleteActivity,
    deleteIntervalActivity
}

