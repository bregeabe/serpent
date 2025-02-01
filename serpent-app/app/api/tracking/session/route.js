import { insertSession } from '../../../../db/utils/sessions/handle-session';

export async function POST(req) {
    try {
        const session = await req.json();
        console.log(session);
        await insertSession(session);
        return new Response(JSON.stringify({ message: 'Session created successfully' }), { status: 200 });
    } catch (err) {
        console.error('Session creation error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}
