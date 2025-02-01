import { insertActivity } from '../../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const activity = await req.json();
        await insertActivity(activity);
        return new Response(JSON.stringify({ message: 'Activity inserted successfully' }), { status: 200 });
    } catch (err) {
        console.error('Insert activity error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}