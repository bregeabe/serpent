import { deleteIntervalActivity } from '../../../../../../db/utils/sessions/handle-session';

export async function DELETE(req) {
    try {
        const intervalActivity = await req.json();
        const msg = await deleteIntervalActivity(intervalActivity.interval_activity_id);
        return msg;
    } catch (err) {
        console.error('interval activity deletion error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}