import { createActivity } from '../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const activity = await req.json();
        await createActivity(activity);
        return new Response(JSON.stringify({ message: 'Activity created successfully' }), { status: 200 });
    } catch (err) {
        console.error('Activity creation error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}