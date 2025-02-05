import { deleteActivity } from '../../../../../db/utils/sessions/handle-session';

export async function DELETE(req) {
    try {
        const activity = await req.json();
        const msg = await deleteActivity(activity.activity_id);
        return msg;
    } catch (err) {
        console.error('Activity deletion error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}