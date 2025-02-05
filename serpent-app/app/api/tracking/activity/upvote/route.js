import { upvoteActivity } from '../../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const { activity_id } = await req.json();
        if (!activity_id) {
            return new Response(JSON.stringify({ message: 'Activity ID is required' }), { status: 400 });
        }
        const msg = await upvoteActivity(activity_id);
        return msg;
    } catch (err) {
        console.error('Upvote error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}