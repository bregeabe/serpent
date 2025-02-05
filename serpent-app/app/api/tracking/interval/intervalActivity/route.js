import { upsertIntervalActivity } from '../../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const activity = await req.json();
        const msg = await upsertIntervalActivity(activity);
        return msg
    } catch (err) {
        console.error('Insert activity error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}