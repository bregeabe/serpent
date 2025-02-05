import { upsertInterval } from '../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const interval = await req.json();
        const msg = await upsertInterval(interval);
        return msg;
    } catch (err) {
        console.error('Interval creation error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}