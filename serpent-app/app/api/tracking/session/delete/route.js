import { deleteSession } from '../../../../../db/utils/sessions/handle-session';

export async function DELETE(req) {
    try {
        const session = await req.json();
        const msg = await deleteSession(session.session_id);
        return msg;
    } catch (err) {
        console.error('session deletion error:', err.message);
        return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
    }
}