import { insertInterval } from '../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const interval = await req.json();
        await insertInterval(interval);
        return new Response(JSON.stringify({ message: 'Interval created successfully' }), { status: 200 });
    } catch (err) {
        console.error('Interval creation error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}