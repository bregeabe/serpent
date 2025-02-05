import { matchesGlob } from 'path';
import { upsertActivity } from '../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const activity = await req.json();
        const msg = await upsertActivity(activity);
        return msg;
    } catch (err) {
        console.error('Activity creation error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}